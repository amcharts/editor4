/**
 * Specifies the browser target for the Editor instance.
 */
export interface ILauncherTarget {
  /**
   * Show Editor in a separate browser window or inline (in an iframe)
   */
  type?: 'window' | 'inline';

  /**
   * Depending on [[ILauncherTarget.type]] specifies either a window
   * or an HTML element where Editor should be rendered.
   */
  target?: string | HTMLElement | Window;

  /**
   * In case of a `window` target, specify browser window features here.
   */
  windowFeatures?: string;
}

/**
 * Supported Launcher event types
 */
export type LauncherEventType = 'save' | 'close';

/**
 * Event argument type for Launcher event handlers.
 */
export interface ILauncherEventArguments {
  /**
   * Chart config (objec-style/JSON-style) created or edited in the Editor.
   */
  chartConfig: object;

  /**
   * Themes selected in the Editor.
   *
   * Use to apply themes in your chart display code.
   */
  appliedThemes?: string[];

  /**
   * License infromation entered in the Editor.
   *
   * Use in your chart display code to apply amCharts licenses.
   */
  appliedLicenses?: string[];
}

/**
 * Launcher event handler type.
 */
export type LauncherEventHandler = (event?: ILauncherEventArguments) => void;

/**
 * amCharts 4 Editor launcher configuration settings.
 */
export interface ILauncherConfig {
  /**
   * Editor target settings specifying where to open the Editor.
   *
   * You can control whether the Editor opens in a new window/tab, inline "popup",
   * or within your specific HTML element (usually a div).
   */
  target?: ILauncherTarget;
  /**
   * Location of the Editor app files.
   *
   * By default the Editor launcher expects the Editor files to be under the `/am4editor/` directory.
   * In case you place these files in a different location, you should set this property to inform
   * the Editor launcher of the new location.
   *
   * @see [Setting up copying of the Editor “app”](https://www.amcharts.com/docs/editor4/getting-started/basics/#Setting_up_copying_of_the_Editor_app_)
   * @default /am4editor/
   */
  editorUrl?: string;
}
