import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { StyleClass, css } from '../../../utils/Style';
import IBaseProps from '../../core/IBaseProps';
import { observer } from 'mobx-react';

import IConfig from '../../../classes/IConfig';
import ConfigManager from '../../../classes/ConfigManager';

const loaderStyle = new StyleClass(css`
  background-color: #fff;
  position: absolute;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
`);

interface ILoaderProps extends IBaseProps, RouteComponentProps {
  onEditorConfigLoaded: (config: IConfig) => void;
  onChartImported: (config: object) => void;
}

@observer
class Loader extends Component<ILoaderProps> {
  public constructor(props: Readonly<ILoaderProps>) {
    super(props);

    this.setConfig = this.setConfig.bind(this);
    this.handleChartImported = this.handleChartImported.bind(this);
    this.receiveLauncherMessage = this.receiveLauncherMessage.bind(this);
    this.loadDefaultConfig = this.loadDefaultConfig.bind(this);
  }

  private setConfig() {
    // window or iframe
    const launcherWindow = window.opener
      ? (window.opener as Window)
      : window.parent !== window
      ? window.parent
      : null;
    if (launcherWindow) {
      window.addEventListener('message', this.receiveLauncherMessage, false);
      launcherWindow.postMessage('amcharts4-editor-loaded', '*');
    } else {
      this.loadDefaultConfig();
    }
  }

  private loadDefaultConfig() {
    if (this.props.onEditorConfigLoaded) {
      // set default config
      const defaultCfg = ConfigManager.getDefaultConfig();
      this.props.onEditorConfigLoaded(defaultCfg);
      this.props.history.push('/home');
    }
  }

  private async receiveLauncherMessage(event: MessageEvent) {
    if (event.data.messageType === 'amcharts4-editor-message') {
      if (event.data.config) {
        this.props.onEditorConfigLoaded(event.data.config);
        if (event.data.config.chartConfig !== undefined) {
          await this.handleChartImported(event.data.config.chartConfig);
        } else {
          this.props.history.push('/home');
        }
      } else {
        this.loadDefaultConfig();
      }
    }
  }

  public componentDidMount() {
    this.setConfig();
  }

  public render() {
    return <div className={loaderStyle.className}>Loading...</div>;
  }

  private async handleChartImported(config: IConfig) {
    if (this.props.onChartImported) {
      await this.props.onChartImported(config);
      this.props.history.push('/design');
    }
  }
}

export default Loader;
