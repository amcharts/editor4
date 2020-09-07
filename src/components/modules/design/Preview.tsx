import React, { Component } from 'react';
import { observer } from 'mobx-react';

import * as am4core from '@amcharts/amcharts4/core';
import '@amcharts/amcharts4/charts';
import '@amcharts/amcharts4/maps';

/* eslint-disable @typescript-eslint/camelcase */
import am4themes_amcharts from '@amcharts/amcharts4/themes/amcharts';
import am4themes_amchartsdark from '@amcharts/amcharts4/themes/amchartsdark';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import am4themes_frozen from '@amcharts/amcharts4/themes/frozen';
import am4themes_kelly from '@amcharts/amcharts4/themes/kelly';
import am4themes_material from '@amcharts/amcharts4/themes/material';
import am4themes_microchart from '@amcharts/amcharts4/themes/microchart';
import am4themes_moonrisekingdom from '@amcharts/amcharts4/themes/moonrisekingdom';
import am4themes_spiritedaway from '@amcharts/amcharts4/themes/spiritedaway';
/* eslint-enable @typescript-eslint/camelcase */

import { StyleClass, css } from '../../../utils/Style';
import PropertyConfigManager from '../../../classes/PropertyConfigManager';
import IBaseProps from '../../core/IBaseProps';

import editorTheme from './../../../themes/editor/EditorTheme';
import { observable, action } from 'mobx';
import { Switch, Navbar, Button, Alignment } from '@blueprintjs/core';

interface IThemeStore {
  [index: string]: am4core.ITheme;
}

/* eslint-disable @typescript-eslint/camelcase */
const themeStore: IThemeStore = {
  am4themes_amcharts: am4themes_amcharts,
  am4themes_amchartsdark: am4themes_amchartsdark,
  am4themes_animated: am4themes_animated,
  am4themes_dark: am4themes_dark,
  am4themes_dataviz: am4themes_dataviz,
  am4themes_frozen: am4themes_frozen,
  am4themes_kelly: am4themes_kelly,
  am4themes_material: am4themes_material,
  am4themes_microchart: am4themes_microchart,
  am4themes_moonrisekingdom: am4themes_moonrisekingdom,
  am4themes_spiritedaway: am4themes_spiritedaway
};
/* eslint-enable @typescript-eslint/camelcase */

const previewPanelStyle = new StyleClass(css`
  background-color: ${editorTheme.previewAreaBackground};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`);

const toolbarGroupStyle = new StyleClass(css`
  justify-items: center;
`);

const switchControlStyle = new StyleClass(css`
  margin: 5px 0px;
`);

const previewDivStyle = new StyleClass(css`
  background-color: white;
  flex-grow: 2;
  margin: 20px;
`);

@observer
class Preview extends Component<IBaseProps> {
  @observable private previewBackgroundColor = 'white';
  private chart?: am4core.Sprite;
  private currentConfig = {};
  private currentThemes: string[] = [];
  private isRefreshPending = false;
  private autoRefreshId?: number = undefined;
  @observable private isAutoRefreshEnabled = true;

  public componentDidMount() {
    const cfgObject = this.getChartConfig();
    this.currentConfig = cfgObject;
    if (this.props.editorState.appliedThemes) {
      this.currentThemes.push(...this.props.editorState.appliedThemes);
    }
    this.renderChart(this.currentConfig);
    this.autoRefreshId = window.setInterval(this.autoRefresh, 5000);
  }

  public componentDidUpdate() {
    const cfgObject = this.getChartConfig();
    if (JSON.stringify(this.currentConfig) !== JSON.stringify(cfgObject)) {
      this.currentConfig = cfgObject;
      this.isRefreshPending = true;
    }
    if (
      this.props.editorState.appliedThemes &&
      this.props.editorState.appliedThemes.join('-') !==
        this.currentThemes.join('-')
    ) {
      this.currentThemes.splice(
        0,
        this.currentThemes.length,
        ...this.props.editorState.appliedThemes
      );
      this.isRefreshPending = true;
    }
  }

  @action.bound
  private autoRefresh() {
    if (this.isAutoRefreshEnabled) {
      this.refreshIfNeeded();
    }
  }

  @action.bound
  private refreshIfNeeded() {
    if (this.isRefreshPending) {
      this.isRefreshPending = false;
      this.renderChart(this.currentConfig);
    }
  }

  private getChartConfig() {
    if (this.props.editorState.chartProperties) {
      return PropertyConfigManager.propertyToConfig(
        this.props.editorState.chartProperties,
        this.props.editorState.chartData
      );
    } else {
      return {};
    }
  }

  private renderChart(cfgObject: object) {
    am4core.disposeAllCharts();
    am4core.unuseAllThemes();
    // if (this.chart) {
    //   console.log(`preview disp: ${this.chart.uid}`);
    //   this.chart.dispose();
    // }

    if (this.props.editorState.chartProperties) {
      this.currentThemes.forEach(themeName => {
        am4core.useTheme(themeStore[themeName]);
      });
      const interfaceColors = new am4core.InterfaceColorSet();
      this.previewBackgroundColor = interfaceColors.getFor('background').hex;

      if (this.props.editorState.licenseNumbers) {
        this.props.editorState.licenseNumbers.forEach(license => {
          am4core.addLicense(license);
        });
      }

      // const cfgRenderCopy = await PropertyConfigManager.resolveGeoData(
      //   cfgObject
      // );
      this.chart = am4core.createFromConfig(
        JSON.parse(JSON.stringify(cfgObject)),
        document.getElementById('chartdiv') as HTMLElement
      );
    }
  }

  public componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.autoRefreshId) {
      window.clearInterval(this.autoRefreshId);
    }
  }

  public render() {
    const lang = this.props.editorState.language;

    // eslint-disable-next-line
    const cfg = JSON.stringify(this.getChartConfig());
    // eslint-disable-next-line
    let themes = '';
    if (this.props.editorState.appliedThemes) {
      themes = this.props.editorState.appliedThemes.join(', ');
    }
    // eslint-disable-next-line
    let licenses = '';
    if (this.props.editorState.licenseNumbers) {
      licenses = this.props.editorState.licenseNumbers.join(', ');
    }

    return (
      <div className={previewPanelStyle.className}>
        <Navbar>
          <Navbar.Group
            align={Alignment.RIGHT}
            className={toolbarGroupStyle.className}
          >
            <Button
              minimal={true}
              icon="refresh"
              text={lang.getUiTranslation('preview.refresh', 'refresh')}
              disabled={this.isAutoRefreshEnabled}
              onClick={this.refreshIfNeeded}
            />
            <Switch
              checked={this.isAutoRefreshEnabled}
              innerLabel={lang.getUiTranslation(
                'preview.auto_refresh_inner',
                'auto'
              )}
              title={lang.getUiTranslation(
                'preview.auto_refresh_title',
                'toggle auto refresh'
              )}
              alignIndicator="right"
              inline={true}
              className={switchControlStyle.className}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.isAutoRefreshEnabled = event.target.checked;
              }}
            />
          </Navbar.Group>
        </Navbar>
        <div
          className={previewDivStyle.className}
          style={{ backgroundColor: this.previewBackgroundColor }}
          id="chartdiv"
        />
        {/* {cfg} */}
      </div>
    );
  }
}

export default Preview;
