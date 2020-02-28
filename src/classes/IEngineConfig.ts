export interface IThemeInfo {
  name: string;
  label: string;
}

export interface IEngineConfig {
  availableThemes?: IThemeInfo[];
  appliedThemes?: string[];
  licenseNumbers?: string[];
}
