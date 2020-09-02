import IValueType from './IValueType';

/**
 * Defines meta-data for every chart property
 *
 * @export
 * @interface IProperty
 */
export default interface IProperty {
  name: string;
  displayName?: string;
  toStringProperty?: string;
  groupName?: string;
  isCore?: boolean;
  orderNo?: number;
  valueTypes?: IValueType[];
  editorType?: string;
  omitValueType?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  properties?: IProperty[];
  modules?: string[];
  path?: string;
}
