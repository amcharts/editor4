/**
 * Basic information about a chart theme (shown in Editor dropdowns)
 */
export interface IThemeInfo {
  /**
   * Theme name (eg. `am4themes_dark`).
   */
  name: string;
  /**
   * Display name for the theme (eg. `Dark`).
   */
  label: string;
}
/**
 * amCharts 4 engine (am4core) settings for the Editor
 */
export interface IEngineConfig {
  /**
   * Built-in amCharts themes shown in the Editor's theme selector.
   *
   * Array of name-label pairs (see [[IThemeInfo]]).
   */
  availableThemes?: IThemeInfo[];
  /**
   * Names of themes to be applied to a specific chart being edited.
   */
  appliedThemes?: string[];
  /**
   * An array of amCharts 4 license numbers applied (if applicable)
   */
  licenseNumbers?: string[];
}
