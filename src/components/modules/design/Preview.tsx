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
import { observable } from 'mobx';

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
`);

const previewDivStyle = new StyleClass(css`
  background-color: white;
  flex-grow: 1;
  margin: 20px;
`);

@observer
class Preview extends Component<IBaseProps> {
  @observable private previewBackgroundColor = 'white';
  private chart?: am4core.Sprite;

  public componentDidMount() {
    this.renderChart();
  }

  public componentWillUpdate() {
    this.renderChart();
  }

  private async renderChart() {
    if (this.chart) {
      this.chart.dispose();
      am4core.unuseAllThemes();
    }

    if (this.props.editorState.chartProperties) {
      if (this.props.editorState.appliedThemes) {
        this.props.editorState.appliedThemes.forEach(themeName => {
          am4core.useTheme(themeStore[themeName]);
        });
        const interfaceColors = new am4core.InterfaceColorSet();
        this.previewBackgroundColor = interfaceColors.getFor('background').hex;
      }

      if (this.props.editorState.licenseNumbers) {
        this.props.editorState.licenseNumbers.forEach(license => {
          am4core.addLicense(license);
        });
      }

      const cfgObject = PropertyConfigManager.propertyToConfig(
        this.props.editorState.chartProperties,
        this.props.editorState.chartData
      );
      const cfgRenderCopy = await PropertyConfigManager.resolveGeoData(
        cfgObject
      );
      this.chart = am4core.createFromConfig(
        cfgRenderCopy,
        document.getElementById('chartdiv') as HTMLElement
      );
    }
  }

  public componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  public render() {
    const cfgObject = this.props.editorState.chartProperties
      ? PropertyConfigManager.propertyToConfig(
          this.props.editorState.chartProperties,
          this.props.editorState.chartData
        )
      : {};
    // eslint-disable-next-line
    const cfg = JSON.stringify(cfgObject);
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
