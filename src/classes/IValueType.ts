/**
 * Describes chart property value types
 *
 * @export
 * @interface IValueType
 */
export default interface IValueType {
  name: string;
  kind: 'value' | 'ref' | 'literal';
  subTypes?: IValueType[];
}
