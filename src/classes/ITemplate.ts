/**
 * Chart template specification for creating templates to be passed in the [[IConfig.templates]].
 *
 * The templates are displayed to the end-user on the "Home" screen of the Editor.
 * Fields of ITemplate are used to both display template selectors and instantiate a new chart ([[ITemplate.config]]).
 */
export default interface ITemplate {
  /**
   * Internal template ID (should be unique)
   */
  id: string;
  /**
   * Name displayed in the template list.
   */
  displayName: string;
  /**
   * Preview image displayed in the template list.
   *
   * Bundled template previews are 600x400 pixels in size.
   */
  previewSrc?: string;
  /**
   * Additional template discription.
   */
  description?: string;
  /**
   * Chart configuration for the template.
   *
   * This object-style (JSON-type) chart configuration will be used to instantiate a new chart in the editor.
   * Make sure to supply initial sample data so that a chart is show to the user when this configuration loads.
   */
  config: object;
}
