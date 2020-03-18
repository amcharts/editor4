import { ILauncherConfig, ILauncherTarget } from './config/ILauncherConfig';

/**
 * Main class to control amCharts 4 Editor in a bigger solution.
 * @important
 */
export class EditorLauncher {
  private config: ILauncherConfig;
  private editorWindow: Window;
  private editorIFrame: HTMLIFrameElement;
  private editorHostDiv: HTMLDivElement;
  private target: ILauncherTarget;

  /**
   * Launches amCharts 4 Editor with specified configuration.
   *
   * @param config Editor configuration
   */
  public launch = (config: ILauncherConfig) => {
    this.config = config;

    window.addEventListener('message', this.editorMessageHandler, false);

    this.target =
      config.target !== undefined
        ? config.target
        : {
            type: 'window',
            target: '_blank',
            windowFeatures:
              'width=900,height=600,menubar=yes,location=no,resizable=yes,scrollbars=yes,status=yes'
          };
    if (this.target.type === undefined) {
      this.target.type = 'window';
      this.target.target = '_blank';
    }

    //this.config.target = target;

    const editorUrl =
      config.editorUrl !== undefined
        ? config.editorUrl
        : window.location.hostname === 'localhost'
        ? 'http://localhost:3000/'
        : '//live4test.amcharts.com/';

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
        this.editorIFrame.src = editorUrl;
        this.target.target.appendChild(this.editorIFrame);
        this.editorWindow = this.editorIFrame.contentWindow;
        break;
      }
      case 'window':
      default: {
        this.editorWindow = window.open(
          editorUrl,
          this.target.target !== undefined
            ? this.target.target.toString()
            : '_blank',
          this.target.windowFeatures
        );
      }
    }
  };

  private editorMessageHandler = (event: MessageEvent) => {
    // console.log(event);
    // console.log(this.editorWindow);
    if (event.source === this.editorWindow) {
      if (event.data === 'amcharts4-editor-loaded') {
        // console.log('editor window message received');
        this.editorWindow.postMessage(
          {
            messageType: 'amcharts4-editor-message',
            config: this.config.editorConfig
          },
          '*'
        );
      } else if (
        event.data.messageType === 'amcharts4-editor-result' &&
        this.config.okCallback !== undefined
      ) {
        this.config.okCallback(
          event.data.config,
          event.data.appliedThemes,
          event.data.licenseNumbers
        );
      } else if (
        event.data.messageType === 'amcharts4-editor-cancel' &&
        this.config.cancelCallback !== undefined
      ) {
        this.config.cancelCallback();
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
}
