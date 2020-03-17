import ITemplate from './ITemplate';

/**
 * Editor template group. Used to group templates into tabs.
 */
export default interface ITemplateGroup {
  /**
   * Template group name.
   */
  name: string;
  /**
   * Templates in the group.
   */
  templates: ITemplate[];
}
