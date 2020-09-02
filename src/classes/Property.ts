import { observable } from 'mobx';

import IProperty from './IProperty';
import IValueType from './IValueType';

/**
 * Holds data about each chart property.
 *
 * @export
 * @class Property
 * @implements {IProperty}
 */
export default class Property implements IProperty {
  public name: string;
  public displayName: string;
  public toStringProperty?: string;
  public groupName: string;
  public isCore?: boolean;
  public orderNo: number;
  public valueTypes?: IValueType[];
  public editorType: string;
  public omitValueType?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @observable public value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public autoValue: any; // value set by chart engine
  @observable public properties?: Property[];
  /**
   * Is the property set via config/code?
   *
   * @type {boolean}
   */
  @observable public isSet?: boolean;
  /**
   * Is the property set by user in UI?
   *
   * @type {boolean}
   */
  @observable public isUserSet?: boolean;
  public modules?: string[];
  public path: string;

  public constructor(prop: IProperty) {
    this.name = prop.name;
    this.displayName = prop.displayName ? prop.displayName : prop.name;
    this.toStringProperty = prop.toStringProperty;
    this.groupName = prop.groupName ? prop.groupName : 'misc-features';
    this.isCore = prop.isCore;
    this.orderNo =
      prop.orderNo !== undefined ? prop.orderNo : Number.MAX_SAFE_INTEGER;
    this.valueTypes = prop.valueTypes;
    this.editorType = prop.editorType ? prop.editorType : 'string';
    this.omitValueType = prop.omitValueType;
    this.value = prop.value;
    this.modules = prop.modules;
    this.path = prop.path !== undefined ? prop.path : prop.name;

    // populate subproperties
    // @todo extract from constructor?
    if (prop.properties && prop.properties.length > 0) {
      this.properties = new Array<Property>();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      prop.properties.forEach(p => this.properties!.push(new Property(p)));
    }
  }

  public getStringPropertyValue(propertyName: string): string | undefined {
    if (this.properties) {
      const property = this.properties.find(p => p.name === propertyName);
      if (property !== undefined && property.value !== undefined) {
        return property.value.toString();
      }
    }

    return undefined;
  }

  public setStringPropertyValue(propertyName: string, value: string) {
    if (this.properties) {
      const property = this.properties.find(p => p.name === propertyName);
      if (property !== undefined) {
        property.value = value;
        property.isUserSet = true;
      }
    }
  }
}
