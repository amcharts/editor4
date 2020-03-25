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
 * Support Launcher event types
 */
export type LauncherEventType = 'save' | 'close';

/**
 * Event argument type for Launcher event handlers.
 */
export interface ILauncherEventArguments {
  /**
   * Chart created or edited in the Editor.
   */
  chartConfig: object;

  /**
   * Themes selected in the Editor.
   */
  appliedThemes?: string[];

  /** License infromation entered in the Editor. */
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
   */
  target?: ILauncherTarget;
  /**
   * Location of the Editor app files.
   * @default /am4editor/
   */
  editorUrl?: string;
}
