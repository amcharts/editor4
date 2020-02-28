import IProperty from './IProperty';

interface IPropertyDefaultsChunk {
  [key: string]: IPropertyDefaults;
}

/**
 * Represents string-indexed property array.
 *
 * @interface IPropertyDefaults
 */
export interface IPropertyDefaults {
  [key: string]: IProperty;
}

/**
 * Factory class to return default Property structure for classes.
 *
 * @export
 * @class PropertyDefaults
 */
export default class PropertyDefaults {
  public defaults: IPropertyDefaultsChunk = {};

  /**
   * Returns Property tree for a class name or undefined if not found.
   *
   * @param {string} forClass
   * @returns {(IProperty | undefined)}
   */
  public getDefaults(forClass: string): IProperty | undefined {
    const forClassPart = forClass.startsWith('propertyFields::')
      ? forClass.substr('propertyFields::'.length)
      : forClass;
    const chunk = forClassPart.charAt(1).toUpperCase();
    if (this.defaults[chunk] && this.defaults[chunk][forClassPart]) {
      const defaultsCopy = JSON.parse(
        JSON.stringify(this.defaults[chunk][forClassPart])
      );
      if (forClass.startsWith('propertyFields::')) {
        // special case for propertyFields - change all the properties to string and DataField editor
        if (defaultsCopy.properties !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (defaultsCopy as IProperty).properties!.forEach(prop => {
            prop.editorType = 'DataField';
            prop.valueTypes = [{ kind: 'value', name: 'string' }];
          });
        }
      }
      return defaultsCopy;
    } else {
      // eslint-disable-next-line no-console
      console.log(`Properties not found for ${forClassPart}`);
      // throw new Error(`Properties not found for ${forClass}`);
    }
  }
}
