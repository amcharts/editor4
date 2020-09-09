/* eslint-disable no-console */

import * as fs from 'fs';
import IProperty from '../../src/classes/IProperty';
import * as jsbeautifier from 'js-beautify';

import common from './../../src/utils/lang/en/common';
import properties from './../../src/utils/lang/en/properties';

interface IPropertyDefaults {
  [key: string]: IProperty;
}

export interface ITranslationBlock {
  [key: string]: string;
}

export interface IPropertyNameCounts {
  [key: string]: number;
}

const allDefaults: IPropertyDefaults = {};

const commonTranslations: ITranslationBlock = common;
const propertyTranslations: ITranslationBlock = properties;

const propertyCounts: IPropertyNameCounts = {};

const defaultsChunks = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'.split('');

defaultsChunks.forEach(chunk => {
  Object.assign(
    allDefaults,
    JSON.parse(
      fs.readFileSync(
        `./../../public/defaults/propertyDefaultValues_${chunk}.js`,
        'utf8'
      )
    )
  );
});

function getAutoDisplayName(name: string): string {
  const sentenceName = name.replace(/([a-z])([A-Z])/g, '$1 $2');
  return (
    sentenceName.charAt(0).toUpperCase() + sentenceName.slice(1).toLowerCase()
  );
}

Object.keys(allDefaults).forEach(className => {
  const cls = allDefaults[className];
  if (cls.properties !== undefined) {
    cls.properties.forEach(prop => {
      propertyCounts[prop.name] = Object.keys(propertyCounts).includes(
        prop.name
      )
        ? propertyCounts[prop.name] + 1
        : 1;
    });
  }
});
Object.keys(allDefaults).forEach(className => {
  const cls = allDefaults[className];
  propertyTranslations[cls.name] = cls.displayName
    ? cls.displayName
    : getAutoDisplayName(cls.name);
  if (cls.properties !== undefined) {
    cls.properties.forEach(prop => {
      if (cls.name === 'IAxisTickProperties' && prop.name === 'align') {
        console.log(`IAxisTickProperties.align: ${propertyCounts[prop.name]}`);
      }
      const translation = prop.displayName
        ? prop.displayName
        : getAutoDisplayName(prop.name);
      if (
        propertyCounts[prop.name] > 1 &&
        propertyTranslations[`${cls.name}.${prop.name}`] === undefined
      ) {
        if (commonTranslations[prop.name] === undefined) {
          commonTranslations[prop.name] = translation;
        }
      } else if (
        // don't overwrite manual translation
        propertyTranslations[`${cls.name}.${prop.name}`] === undefined
      ) {
        propertyTranslations[`${cls.name}.${prop.name}`] = translation;
      }
    });
  }
});

//console.log(propertyTranslations);
//console.log(propertyCounts);
console.log(Object.keys(commonTranslations).length);
console.log(Object.keys(propertyTranslations).length);

/* eslint-disable @typescript-eslint/camelcase */
const beatifyOptions: JsBeautifyOptions = {
  jslint_happy: true
};
/* eslint-enable @typescript-eslint/camelcase */

fs.writeFileSync(
  './../../src/utils/lang/en/common.ts',
  'export default ' +
    jsbeautifier.js_beautify(
      JSON.stringify(commonTranslations),
      beatifyOptions
    ),
  'utf8'
);

fs.writeFileSync(
  './../../src/utils/lang/en/properties.ts',
  'export default ' +
    jsbeautifier.js_beautify(
      JSON.stringify(propertyTranslations),
      beatifyOptions
    ),
  'utf8'
);

console.log('done');
