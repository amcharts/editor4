/**
 * Basic information about chart theme (shown in Editor dropdowns)
 */
export interface IThemeInfo {
  name: string;
  label: string;
}
/**
 * amCharts 4 engine (am4core) settings for the Editor
 */
export interface IEngineConfig {
  /**
   * Themes shown in the Editor's theme selector.
   */
  availableThemes?: IThemeInfo[];
  /**
   * Themes applied to a specific edited chart.
   */
  appliedThemes?: string[];
  /**
   * License numbers applied.
   */
  licenseNumbers?: string[];
}
