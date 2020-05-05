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
   * Get URI for the editor application
   */
  public get editorUrl(): string | undefined {
    return this._config.editorUrl;
  }
  /**
   * Set URI for the editor application
   */
  public set editorUrl(value: string) {
    this._config.editorUrl = value;
  }

  /**
   * Get target settings for how to open the editor window.
   */
  public get target(): ILauncherTarget {
    return this._config.target;
  }
  /**
   * Set target settings for how to open the editor window.
   */
  public set target(value: ILauncherTarget) {
    this._config.target = value;
  }

  private _editorConfig: IConfig = {};
  /**
   * Get editor configuration settings.
   */
  public get editorConfig(): IConfig {
    return this._editorConfig;
  }
  /**
   * Set editor configuration settings.
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
   * Launches amCharts 4 Editor with specified configuration.
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
   * Closes Editor windows and cleans up if needed
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
   * Add event listener for Launcher events ('save' or 'close')
   */
  public addEventListener = (
    eventType: LauncherEventType,
    listener: LauncherEventHandler
  ) => {
    this.eventHanlders.get(eventType).push(listener);
  };

  /**
   * Remove event listener for Launcher events
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
