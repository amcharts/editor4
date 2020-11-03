import {
  ILauncherConfig,
  ILauncherTarget,
  LauncherEventType,
  ILauncherEventArguments,
  LauncherEventHandler
} from './config/ILauncherConfig';
import IConfig from './../../src/classes/IConfig';

/**
 * Main class to control amCharts 4 Editor in a bigger solution.
 *
 * There are 4 essential steps needed to use the Editor in your app
 * (make sure you read [the setup guide](https://www.amcharts.com/docs/editor4/getting-started/basics/#Installation) too):
 *
 * 1. Create and instance of `EditorLauncher`;
 * 2. Add event listeners for `save` and `close` events;
 * 3. Set editor configuration;
 * 4. Launch the editor.
 *
 * Here's how this would look in code:
 * ```TypeScript
 * // import Editor Launcher
 * import * as am4editor from '@amcharts/editor4';
 *
 * // instantiate launcher
 * let launcher = new am4editor.EditorLauncher();
 *
 * // add event listeners
 * launcher.addEventListener('save', renderChart);
 * launcher.addEventListener('close', () => {
 *   if (this.launcher) {
 *     this.launcher.close();
 *   }
 * });
 *
 * // set config
 * launcher.editorConfig = editorConfig;
 *
 * // launch
 * launcher.launch();
 * ```
 *
 * @see [amCharts Editor 4 Architecture, Installation, and Usage](https://www.amcharts.com/docs/editor4/getting-started/basics/)
 * @see {@link IConfig} - editor configuration
 * @see {@link ILauncherConfig} - launcher configuration
 * @see {@link LauncherEventHandler} - launcher event handler type
 * @important
 */
export class EditorLauncher {
  private _config: ILauncherConfig = {
    editorUrl: '/am4editor/',
    target: {
      type: 'inline'
    }
  };

  /**
   */
  public get editorUrl(): string | undefined {
    return this._config.editorUrl;
  }
  /**
   * URI for the editor application.
   *
   * By default Editor application is expected to be under `/am4editor/`.
   * Set this property to a new location, in case you've changed the default folder structure.
   */
  public set editorUrl(value: string) {
    this._config.editorUrl = value;
  }

  /**
   */
  public get target(): ILauncherTarget {
    return this._config.target;
  }
  /**
   * Set this to control how to open the editor window.
   *
   * When you call the [[launch()]] method, it opens the Editor based on this setting.
   * The Editor can open in an `inline` popup or a new browser window/tab.
   * Additionally, you can make it open inside a particular element (usually a DIV) on your page.
   *
   * @see {@link ILauncherTarget}
   */
  public set target(value: ILauncherTarget) {
    this._config.target = value;
  }

  private _editorConfig: IConfig = {};
  /**
   */
  public get editorConfig(): IConfig {
    return this._editorConfig;
  }
  /**
   * Editor configuration settings.
   *
   * Configure various aspects of the Editor look, feel, and behavior via these settings.
   *
   * @see {@link IConfig}
   */
  public set editorConfig(value: IConfig) {
    this._editorConfig = value;
  }

  private editorWindow: Window;
  private editorIFrame: HTMLIFrameElement;
  private editorHostDiv: HTMLDivElement;
  private eventHanlders: Map<
    LauncherEventType,
    LauncherEventHandler[]
  > = new Map([['save', []], ['close', []]]);

  /**
   * Creates an instance of EditorLauncher.
   * @param {ILauncherConfig} [launcherConfig] Optional launcher settings.
   */
  constructor(launcherConfig?: ILauncherConfig) {
    if (launcherConfig !== undefined) {
      this._config = launcherConfig;
      if (this._config.target === undefined) {
        this._config.target = {
          type: 'inline'
        };
      }
      if (this._config.editorUrl === undefined) {
        this._config.editorUrl = '/am4editor/';
      }
    }
  }

  private _editorLicense?: string;

  /**
   * Sets editor license number
   */
  public addLicense = (editorLicense: string) => {
    this._editorLicense = editorLicense;
  };

  /**
   * Launches amCharts 4 Editor.
   *
   * You can pass a chart configuration object for editing.
   * Creates a new chart otherwise.
   *
   * @param config Chart configuration to edit (if editing).
   */
  public launch = (chartConfig?: object) => {
    window.addEventListener('message', this.editorMessageHandler, false);

    if (chartConfig !== undefined) {
      this._editorConfig.chartConfig = chartConfig;
    } else {
      this._editorConfig.chartConfig = undefined;
    }

    switch (this.target.type) {
      case 'inline': {
        if (this.target.target) {
          if (!(this.target.target instanceof HTMLElement)) {
            this.target.target = document.getElementById(
              this.target.target.toString()
            );
          }
        } else {
          // create div to host editor's iframe
          this.editorHostDiv = document.createElement('div');
          this.editorHostDiv.style.position = 'absolute';
          this.editorHostDiv.style.top = '0px';
          this.editorHostDiv.style.left = '0px';
          this.editorHostDiv.style.width = '100vw';
          this.editorHostDiv.style.height = '100vh';
          this.editorHostDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
          this.editorHostDiv.style.zIndex = '1000';
          this.editorHostDiv.style.display = 'flex';

          document.body.appendChild(this.editorHostDiv);
          this.target.target = this.editorHostDiv;
        }
        this.editorIFrame = document.createElement('iframe');
        this.editorIFrame.style.display = 'flex';
        this.editorIFrame.style.flexGrow = '2';
        if (this.editorHostDiv !== undefined) {
          this.editorIFrame.style.margin = '30px';
          this.editorIFrame.style.border = '0px';
        }
        this.editorIFrame.src = this._config.editorUrl;
        this.target.target.appendChild(this.editorIFrame);
        this.editorWindow = this.editorIFrame.contentWindow;
        break;
      }
      case 'window':
      default: {
        this.editorWindow = window.open(
          this._config.editorUrl,
          this.target.target !== undefined
            ? this.target.target.toString()
            : '_blank',
          this.target.windowFeatures
        );
      }
    }
  };

  private editorMessageHandler = (event: MessageEvent) => {
    if (event.source === this.editorWindow) {
      if (event.data === 'amcharts4-editor-loaded') {
        // apply license number if applicable
        if (
          this._editorLicense !== undefined &&
          this.editorConfig !== undefined &&
          this.editorConfig.editorLicense === undefined
        ) {
          this.editorConfig.editorLicense = this._editorLicense;
        }

        this.editorWindow.postMessage(
          {
            messageType: 'amcharts4-editor-message',
            config: this.editorConfig
          },
          '*'
        );
      } else if (event.data.messageType === 'amcharts4-editor-result') {
        this.handleEvent('save', {
          chartConfig: event.data.config,
          appliedThemes: event.data.appliedThemes,
          appliedLicenses: event.data.licenseNumbers
        });
      } else if (event.data.messageType === 'amcharts4-editor-cancel') {
        this.handleEvent('close');
      }
    }
  };

  /**
   * Closes the Editor window.
   */
  public close = () => {
    if (this.target && this.target.type && this.target.type === 'window') {
      if (this.editorWindow) {
        this.editorWindow.close();
      }
    } else if (
      this.target &&
      this.target.type &&
      this.target.type === 'inline'
    ) {
      if (this.editorIFrame && this.target.target instanceof HTMLElement) {
        this.target.target.removeChild(this.editorIFrame);
        if (this.editorHostDiv !== undefined) {
          document.body.removeChild(this.editorHostDiv);
          this.editorHostDiv = undefined;
          this.target.target = undefined;
        }
      }
    }

    window.removeEventListener('message', this.editorMessageHandler, false);
  };

  /**
   * Add an event listener for Launcher events ('save' or 'close')
   *
   * ```TypeScript
   * // add event listeners
   * launcher.addEventListener('save', renderChart);
   * launcher.addEventListener('close', () => {
   *   if (this.launcher) {
   *     this.launcher.close();
   *   }
   * });
   * ```
   */
  public addEventListener = (
    eventType: LauncherEventType,
    listener: LauncherEventHandler
  ) => {
    this.eventHanlders.get(eventType).push(listener);
  };

  /**
   * Remove an event listener for Launcher events.
   */
  public removeEventListener = (
    eventType: LauncherEventType,
    listener: LauncherEventHandler
  ) => {
    const listeners = this.eventHanlders.get(eventType);
    const index = listeners.findIndex(l => l === listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };

  private handleEvent = (
    eventType: LauncherEventType,
    event?: ILauncherEventArguments
  ) => {
    const listeners = this.eventHanlders.get(eventType);
    if (listeners !== undefined) {
      listeners.forEach(l => l(event));
    }
  };
}
