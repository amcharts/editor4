import ITemplate from './ITemplate';

/**
 * Editor template group. Used to group templates into tabs.
 *
 * Passed in the [[IConfig.templates]].
 */
export default interface ITemplateGroup {
  /**
   * Template group name (tab label).
   */
  name: string;
  /**
   * Templates in the group.
   *
   * List of template specifications of the [[ITemplate]] type. See [[ITemplate]] for details.
   */
  templates: ITemplate[];
}
