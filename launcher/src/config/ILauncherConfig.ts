import IConfig from './../../../src/classes/IConfig';

export interface ILauncherTarget {
  type?: 'window' | 'inline';
  target?: string | HTMLElement | Window;
  windowFeatures?: string;
}

export interface ILauncherConfig {
  editorConfig: IConfig;
  target?: ILauncherTarget;
  editorUrl?: string;
  okCallback?: (
    chartConfig: object,
    appliedThemes?: string[],
    appliedLicenses?: string[]
  ) => void;
  cancelCallback?: () => void;
}
