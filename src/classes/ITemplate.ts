/**
 * Chart template (starter) specification.
 */
export default interface ITemplate {
  /**
   * Template id (should be unique)
   */
  id: string;
  /**
   * Name displayed in the template list.
   */
  displayName: string;
  /**
   * Preview image displayed in the template list.
   */
  previewSrc?: string;
  /**
   * Additional template discription.
   */
  description?: string;
  /**
   * Chart configuration for the template.
   */
  config: object;
}
