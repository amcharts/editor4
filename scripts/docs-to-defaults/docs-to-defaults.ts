/* eslint-disable no-console */

import * as fs from 'fs';
import IProperty from '../../src/classes/IProperty';
import IValueType from '../../src/classes/IValueType';
import ILiteralListTypes from '../../src/classes/ILiteralListTypes';

const CATEGORY_TAG = 'editor_group'; // editor group id

const ORDER_TAG = 'editor_order_no'; // [optional] property order in the category
const DISPLAYNAME_TAG = 'editor_display_name'; // [optional] property display name
const EDITOR_TYPE_TAG = 'editor_editor_type'; // [optional] property editor type (infered from value type if omitted)
const EDITOR_CORE_TAG = 'editor_core'; // [optional] if set property will be displayed among the main properties
const EDITOR_OMIT_TYPE_TAG = 'editor_omit_type'; // [optional] if set 'type' will not be rendered into config json
const EDITOR_SELECT_VALUES_TAG = 'editor_select_values'; // [optional] if editor type is 'select' and this tag is present values for it will be hardcoded from this list
const EDITOR_NO_AUTOINHERIT_TAG = 'editor_no_autoinherit'; // [optional] do not include the option in the descentant type unless explicitly specified by @editor_include_properties
const EDITOR_VALUE_TYPES = 'editor_value_types'; // [optional] value types for the property (class level types take precedence). If omitted the types are inferred from the type signature

const ITEM_TYPES_TAG = 'editor_item_types';
const TOSTRING_PROPERTY_TAG = 'editor_tostring_property';
const SKIP_PROPERTIES_TAG = 'editor_skip_properties';
const INCLUDE_PROPERTIES_TAG = 'editor_include_properties'; // list of properties with @editor_no_autoinherit tag to include

//#region types
interface IDocs {
  children: IClass[];
}

interface IClass {
  name: string;
  kindString: string;
  children: IProp[];
  comment?: IComment;
  type?: IType | IUnionType;
}

interface IProp {
  name: string;
  kindString: 'Accessor' | 'Property';
  comment: IComment;
  getSignature?: ITypeSignature;
  type?: IType | IUnionType;
}

interface IComment {
  tags: ITag[];
}

interface ITypeSignature {
  type: IType | IUnionType;
}

interface IType {
  type:
    | 'intrinsic'
    | 'reference'
    | 'stringLiteral'
    | 'typeParameter'
    | 'array'
    | 'indexedAccess'
    | 'unknown';
  name?: string;
  value?: string;
  constraint?: IType;
  typeArguments?: IType[];
  elementType?: IType;
}

interface IUnionType {
  type: 'union';
  types: IType[];
}

interface ITag {
  tag: string;
  text: string;
}

interface IItemTypes {
  [key: string]: string[];
}
//#endregion

interface IClassModuleMap {
  [key: string]: string[];
}

const classModuleMap: IClassModuleMap = {};

function fillClassModuleMap(moduleName: string) {
  const exportsRegex = new RegExp(/^export[\s]*\{([^}]*)\}[^$]*$/i);

  const moduleExports = fs
    .readFileSync(`./chart_modules/${moduleName}.ts`, 'utf8')
    .replace(`\r\n`, `\n`)
    .replace(`\r`, `\n`);
  const moduleExportsLines = moduleExports.split(`\n`);
  moduleExportsLines.forEach(line => {
    const [, lineNames] = exportsRegex.exec(line) || [undefined, undefined];
    if (lineNames !== undefined) {
      lineNames
        .trim()
        .split(',')
        .forEach(lineName => {
          const trimmedName = lineName.trim();
          if (classModuleMap[trimmedName] !== undefined) {
            classModuleMap[trimmedName].push(moduleName);
          } else {
            classModuleMap[trimmedName] = [moduleName];
          }
        });
    }
  });
}

fillClassModuleMap('core');
fillClassModuleMap('charts');
fillClassModuleMap('maps');

const docs = JSON.parse(fs.readFileSync('./docs.json', 'utf8')) as IDocs;
// eslint-disable-next-line prettier/prettier
// const docs = JSON.parse(fs.readFileSync('./!old-0.15-docs.json', 'utf8')) as IDocs;
const docsCopy = JSON.parse(JSON.stringify(docs));

const typeAliasTypes = docs.children.filter(t => t.kindString === 'Type alias');

//#region functions
function getTypesTags(cls: IClass): ITag[] {
  if (cls.comment && cls.comment.tags) {
    return cls.comment.tags.filter(tag => tag.tag.startsWith(ITEM_TYPES_TAG));
  } else {
    return undefined;
  }
}

// function getClassCategoryTags(cls: IClass): ITag[] {
//   if (cls.comment && cls.comment.tags) {
//     return cls.comment.tags.filter(tag => tag.tag === CATEGORY_TAG);
//   } else {
//     return undefined;
//   }
// }

function getTagValue(prop: IProp | IClass, tagName: string): string {
  const tag = prop.comment.tags.find(t => t.tag === tagName);
  if (tag && tag.text && tag.text.length > 0) {
    return tag.text.trim();
  } else {
    return undefined;
  }
}

const literalTypes: ILiteralListTypes = {};
const usedLiteralTypes: ILiteralListTypes = {};
function checkLiteralType(typeName: string): boolean {
  if (
    typeName !== 'Optional' && // special case
    literalTypes[typeName] &&
    literalTypes[typeName].length > 0
  ) {
    usedLiteralTypes[typeName] = literalTypes[typeName];
    return true;
  }
  return false;
}

// value types
function getValueTypeKind(
  t: IType,
  propName: string // just for logging issues
): 'value' | 'ref' | 'literal' {
  const typeType = t.type;
  if (typeType === 'intrinsic') {
    return 'value';
  } else if (typeType === 'reference') {
    if (checkLiteralType(t.name)) {
      return 'literal';
    }
    return 'ref';
  } else if (typeType === 'stringLiteral') {
    return 'literal';
  } else {
    console.log(
      `${propName}, Value type: ${
        t.name !== undefined ? t.name : t.value
      }, kind: ${typeType}`
    );
    return 'ref'; // TODO: figure out other options
  }
}

function getClsSubTypes(clsTypes: string[]): IValueType[] {
  return clsTypes.map<IValueType>(t => {
    return { name: t, kind: 'ref' };
  });
}

function getSubTypes(
  topType: IType,
  propName: string // just for logging
): IValueType[] | undefined {
  if (topType.typeArguments && topType.typeArguments.length > 0) {
    const result = new Array<IValueType>();
    topType.typeArguments.forEach(t => {
      if (t.type === 'indexedAccess') {
        result.push({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: `this["${(t as any).indexType.value}"]`,
          kind: 'ref'
        });
      } else if (t.type !== 'unknown' || t.name.match(/this\["_[^\s]*"\]/g)) {
        result.push({
          name: t.name !== undefined ? t.name : t.value,
          kind: getValueTypeKind(t, propName)
        });
      }
    });
    return result;
  } else {
    return undefined;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSpecialClass(className: string): any {
  return docsCopy.children.find(c => c.name === className);
}

function getSpecialPropName(specialName: string): string {
  const rgx = new RegExp(/this\["(_[^\s]*)"\]/, 'g');
  return rgx.exec(specialName)[1];
}

// finds a property representing actual underlying property of those defined through this[_name] constructs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getThisProp(specialClass: any, specialPropName: string): IProp {
  return specialClass.children.find(p => p.name === specialPropName) as IProp;
}
//#endregion

typeAliasTypes.forEach(at => {
  const t = at.type as IUnionType;
  if (t.types) {
    literalTypes[at.name] = (at.type as IUnionType).types.map(ut => ut.value);
  }
});

// get all classes with editor tags
const displayedObjectDocs = docs.children.filter(cls => {
  if (
    !cls.children ||
    cls.children.length === 0 ||
    cls.name.match(/^([a-zA-Z0-9]*)Adapters$/g) !== null // adapters are not supported for now so no point in generating them
    // (cls.name.match(/^([a-zA-Z0-9]*)Properties$/g) !== null &&
    //   cls.name.match(/^I(Slice|Sprite|Tooltip)Properties$/g) === null) // @todo remove temp bloat limiting workaround
  ) {
    return false;
  }

  const props = cls.children.filter(prop => {
    return (
      prop.comment &&
      prop.comment.tags &&
      prop.comment.tags.length > 0 &&
      prop.comment.tags.find(tag => tag.tag === CATEGORY_TAG) !== undefined
    );
  });

  cls.children = props;

  return props.length > 0;
});

const classProperties = new Array<IProperty>();

displayedObjectDocs.forEach(cls => {
  const classProp = {} as IProperty;
  classProp.name = cls.name;
  classProp.modules = classModuleMap[cls.name];

  const clsItemTypes: IItemTypes = {};

  let listedProperties = cls.children;
  let includeProperties: string[] = [];

  if (cls.comment && cls.comment.tags) {
    // get valid item types for list properties
    const typesTags = getTypesTags(cls);
    if (typesTags) {
      typesTags.forEach(tag => {
        const propName = tag.tag.substr(ITEM_TYPES_TAG.length + 2);
        let propItemTypes = tag.text.trim().split(',');
        propItemTypes = propItemTypes.map(t => t.trim());
        clsItemTypes[propName] = propItemTypes;
      });
    }

    // which property's value to use for string representation of the class
    classProp.toStringProperty = getTagValue(cls, TOSTRING_PROPERTY_TAG);

    // get properties that should be skipped
    let skipProperties: string[] = [];
    const skipPropertiesTagValue = getTagValue(cls, SKIP_PROPERTIES_TAG);
    if (skipPropertiesTagValue) {
      const spts = skipPropertiesTagValue.trim().split(',');
      skipProperties = spts.map(sp => sp.trim());
    }
    if (skipProperties.length > 0) {
      listedProperties = cls.children.filter(
        prop => skipProperties.indexOf(prop.name) < 0
      );
    }

    // get no_autoinherit properties that should be included
    const includePropertiesTagValue = getTagValue(cls, INCLUDE_PROPERTIES_TAG);
    if (includePropertiesTagValue) {
      const ipts = includePropertiesTagValue.trim().split(',');
      includeProperties = ipts.map(ip => ip.trim());
    }
  }

  // iterate over properties
  listedProperties.forEach(prop => {
    const includeProperty =
      getTagValue(prop, EDITOR_NO_AUTOINHERIT_TAG) === undefined ||
      includeProperties.indexOf(prop.name) >= 0;
    if (includeProperty) {
      const catName = getTagValue(prop, CATEGORY_TAG);
      const isCore =
        getTagValue(prop, EDITOR_CORE_TAG) !== undefined ? true : undefined;
      const omitValueType =
        getTagValue(prop, EDITOR_OMIT_TYPE_TAG) !== undefined
          ? true
          : undefined;

      // value types
      const valueTypes = new Array<IValueType>();
      let typeProp =
        prop.kindString === 'Accessor'
          ? prop.getSignature.type === undefined
            ? prop.getSignature[0].type
            : prop.getSignature.type
          : prop.type;
      let clsTypes = clsItemTypes[prop.name.toLowerCase()]; // types from class declaration
      if (clsTypes === undefined) {
        // see if there are property level value types
        const valueTypesString = getTagValue(prop, EDITOR_VALUE_TYPES);
        if (
          valueTypesString !== undefined &&
          valueTypesString.trim().length > 0
        ) {
          clsTypes = valueTypesString.trim().split(',');
          clsTypes = clsTypes.map(t => t.trim());
        }
      }

      if (typeProp === undefined) {
        console.log(prop);
      }

      if (
        typeProp.type === 'reference' &&
        (typeProp.name === '$type.Optional' || typeProp.name === 'Optional') &&
        typeProp.typeArguments !== undefined
      ) {
        // special case for fill and other optional properties
        typeProp = typeProp.typeArguments[0];
      }

      if (prop.name === 'propertyFields') {
        // special case for propertyFields
        const specialClass = getSpecialClass(cls.name);
        const thisPropName = getSpecialPropName('this["_properties"]');

        if (specialClass && thisPropName) {
          const thisProp = getThisProp(specialClass, thisPropName);
          valueTypes.push({
            name: `propertyFields::${(thisProp.type as IType).name}`,
            kind: getValueTypeKind(thisProp.type as IType, thisProp.name)
          });
        }
      } else if (typeProp.type === 'union') {
        typeProp.types.forEach(t => {
          const st =
            clsTypes && clsTypes.length > 0
              ? getClsSubTypes(clsTypes)
              : getSubTypes(t, prop.name);
          valueTypes.push({
            name: t.name !== undefined ? t.name : t.value,
            kind: getValueTypeKind(t, prop.name),
            subTypes: st
          });
        });
      } else if (prop.name === 'states') {
        // special case for states
        const st = getSubTypes(typeProp, prop.name);
        const statePropertiesType = getSubTypes(
          typeProp.typeArguments[1],
          prop.name
        )[0];

        if (statePropertiesType.name.match(/this\["_[^\s]*"\]/g)) {
          // special case for properties with type like this["_dataFields"]
          const specialClass = getSpecialClass(cls.name);
          const thisPropName = getSpecialPropName(statePropertiesType.name);

          if (specialClass && thisPropName) {
            const thisProp = getThisProp(specialClass, thisPropName);
            st[1].subTypes = [
              {
                name: (thisProp.type as IType).name,
                kind: getValueTypeKind(thisProp.type as IType, thisProp.name)
              }
            ];
          }
          // console.log(s);
        }

        // console.log(st[1]);
        // console.log(getSubTypes(typeProp.typeArguments[1], prop.name));
        // console.log(typeProp.typeArguments[1].typeArguments[0]);

        valueTypes.push({
          name: typeProp.name,
          kind: getValueTypeKind(typeProp, prop.name),
          subTypes: st
        });
      } else if (
        typeProp.name === 'List' ||
        typeProp.name === 'ListTemplate' ||
        typeProp.name === 'DictionaryTemplate' ||
        typeProp.name === 'SortedListTemplate'
      ) {
        const st =
          clsTypes && clsTypes.length > 0
            ? getClsSubTypes(clsTypes)
            : getSubTypes(typeProp, prop.name);

        if (typeProp.name === 'DictionaryTemplate') {
          st.splice(0, 1); // we are not using the key from DictionaryTemplate for now
        }

        // process special subtypes
        st.forEach(s => {
          if (s.name.match(/this\["_[^\s]*"\]/g)) {
            // special case for properties with type like this["_dataFields"]
            const specialClass = getSpecialClass(cls.name);
            const thisPropName = getSpecialPropName(s.name);

            if (specialClass && thisPropName) {
              const thisProp = getThisProp(specialClass, thisPropName);
              // if (thisProp === undefined) {
              //   console.log(`${cls.name}.${thisPropName}`);
              //   console.log(thisProp);
              // } else
              if (thisProp.type.type !== 'union') {
                // @todo: union is a special case - need to split
                s.name = (thisProp.type as IType).name;
                s.kind = getValueTypeKind(
                  thisProp.type as IType,
                  thisProp.name
                );
              }
            }
            // console.log(s);
          }
        });

        valueTypes.push({
          name: typeProp.name,
          kind: getValueTypeKind(typeProp, prop.name),
          subTypes: st
        });
      } else if (clsTypes && clsTypes.length > 0) {
        clsTypes.forEach(t => {
          valueTypes.push({
            name: t,
            kind: 'ref'
          });
        });
      } else if (
        typeProp.type === 'array' &&
        typeProp.elementType !== undefined
      ) {
        // handle simple arrays for now
        valueTypes.push({
          name: 'Array',
          kind: 'ref',
          subTypes: [
            {
              name: typeProp.elementType.name,
              kind: getValueTypeKind(typeProp.elementType, prop.name)
            }
          ]
        });
      } else if (
        (typeProp.name !== undefined &&
          typeProp.name.match(/this\["_[^\s]*"\]/g)) ||
        typeProp.type === 'indexedAccess'
      ) {
        // special case for properties with type like this["_dataFields"]
        const specialClass = getSpecialClass(cls.name);
        const thisPropName =
          typeProp.type === 'indexedAccess'
            ? typeProp.indexType.value
            : getSpecialPropName(typeProp.name);

        if (specialClass && thisPropName) {
          const thisProp = getThisProp(specialClass, thisPropName);
          if ((thisProp.type as IType).type === 'typeParameter') {
            valueTypes.push({
              name: (thisProp.type as IType).constraint.name,
              kind: getValueTypeKind(
                (thisProp.type as IType).constraint,
                prop.name
              )
            });
          } else {
            valueTypes.push({
              name: (thisProp.type as IType).name,
              kind: getValueTypeKind(thisProp.type as IType, thisProp.name)
            });
          }
        }
      } else if (typeProp.name !== undefined) {
        valueTypes.push({
          name: typeProp.name,
          kind: getValueTypeKind(typeProp, prop.name)
        });
      } else if (typeProp.type === 'reflection') {
        // special case - handle these as strings for now
        valueTypes.push({
          name: 'string',
          kind: 'value'
        });
      } else {
        console.log(
          `Unhandled type: ${prop.name}: ${JSON.stringify(typeProp)}`
        );
      }

      // editor type
      const edTypeArray = valueTypes.sort((t1, t2) =>
        t1.name > t2.name ? 1 : -1
      );
      const editorType = getTagValue(prop, EDITOR_TYPE_TAG)
        ? getTagValue(prop, EDITOR_TYPE_TAG)
        : edTypeArray[0].kind === 'literal'
        ? 'select'
        : edTypeArray.map(et => et.name).join('--');

      if (editorType === 'select') {
        // special case for 'select' editor type with hardcoded values
        const selectValuesTagValue = getTagValue(
          prop,
          EDITOR_SELECT_VALUES_TAG
        );
        if (selectValuesTagValue) {
          // set predefined hardcoded values
          valueTypes.splice(0);
          const selectValues = selectValuesTagValue.trim().split(',');
          selectValues.forEach(sv => {
            valueTypes.push({
              name: sv.trim(),
              kind: 'literal'
            });
          });
        }
      }

      const displayName = getTagValue(prop, DISPLAYNAME_TAG);
      const orderNo = getTagValue(prop, ORDER_TAG)
        ? Number.parseInt(getTagValue(prop, ORDER_TAG), 10)
        : undefined;

      if (classProp.properties === undefined) {
        classProp.properties = new Array<IProperty>();
      }

      classProp.properties.push({
        name: prop.name,
        valueTypes,
        editorType,
        displayName,
        groupName: catName,
        isCore,
        omitValueType,
        orderNo
      });
    }
  });

  classProperties.push(classProp);
});

//console.log(Object.keys(usedLiteralTypes));
//console.log(usedLiteralTypes);

// console.log(JSON.stringify(classProperties));

// write defaults
// fs.writeFileSync('./classprops.json', JSON.stringify(classProperties), 'utf8');

const CLASSPATHROOT = '../../src/classes/';
const df = fs.openSync(`${CLASSPATHROOT}PropertyDefaultsChunks.ts`, 'w');
fs.writeSync(df, `export default [`);

const sortedClassProperties = classProperties.sort((a, b) =>
  a.name.charAt(1).toUpperCase() > b.name.charAt(1).toUpperCase() ? 1 : -1
);

// @todo append some id to control caching?
const chunks: string[] = [];
let comma = '';
sortedClassProperties.forEach(topLevel => {
  const chunk = topLevel.name.charAt(1).toUpperCase();
  if (chunks.indexOf(chunk) < 0) {
    fs.writeSync(df, `${comma}'${chunk}'`);
    chunks.push(chunk);
    comma = ',';
  }
});

fs.writeSync(df, `];\n`);
fs.closeSync(df);

const PATHROOT = '../../public/defaults/';

chunks.forEach(chunk => {
  const chunkdf = fs.openSync(
    `${PATHROOT}propertyDefaultValues_${chunk}.js`,
    'w'
  );
  fs.writeSync(
    chunkdf,
    `{
  `
  );

  let comma = '';
  sortedClassProperties
    .filter(sp => sp.name.charAt(1).toUpperCase() === chunk)
    .forEach(topLevel => {
      fs.writeSync(
        chunkdf,
        `${comma}"${topLevel.name}": ${JSON.stringify(topLevel)}`
      );
      comma = `,\n`;
    });
  fs.writeSync(
    chunkdf,
    `
  }
`
  );
  fs.closeSync(chunkdf);
});

const ltf = fs.openSync('../../src/classes/literalListTypeValues.ts', 'w');
fs.writeSync(
  ltf,
  `/* eslint-disable */

import LiteralListTypes from "./LiteralListTypes";

const literalListTypes = new LiteralListTypes();

`
);

Object.keys(usedLiteralTypes).forEach(ult => {
  fs.writeSync(
    ltf,
    `literalListTypes.literalTypes["${ult}"] = ${JSON.stringify(
      usedLiteralTypes[ult]
    )};\n`
  );
});

fs.writeSync(
  ltf,
  `
export default literalListTypes;
`
);
fs.closeSync(ltf);

// // are names unique? - yes
// docs.children.forEach(cls => {
//     const cnt = docs.children.filter(c => c.name === cls.name).length;
//     if (cnt > 1) {
//         console.log(`${cls.name}: ${cnt}`);
//     }
// });
