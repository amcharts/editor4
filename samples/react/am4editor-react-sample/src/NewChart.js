import React, { Component } from "react";

import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line no-unused-vars
import * as am4charts from '@amcharts/amcharts4/charts';
import '@amcharts/amcharts4/charts'; // "hack" to prevent charts from being optimized-out as unused
// import themes
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

// import Editor Launcher
import * as am4editor from '@amcharts/editor4';

class NewChart extends Component {
  chart;
  launcher;
  previewBackgroundColor = 'white';

  constructor(props) {
    super(props);
    this.launchEditor = this.launchEditor.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.applyChartThemes = this.applyChartThemes.bind(this);
  }

  launchEditor() {
    this.launcher = new am4editor.EditorLauncher(this.props.launcherSettings);

    this.launcher.addEventListener('save', this.renderChart);
    this.launcher.addEventListener('close', () => { 
      if (this.launcher) {
        this.launcher.close(); 
      }
    });

    // create a copy of global editor config so we don't modify it
    const editorConfig = JSON.parse(JSON.stringify(this.props.editorConfig));
    editorConfig.allowDefaultTemplates = true;

    this.launcher.editorConfig = editorConfig;

    this.launcher.launch();
  }

  renderChart(event) {
    if (this.launcher) {
      this.launcher.close();
    }

    if (event.appliedThemes) {
      this.applyChartThemes(event.appliedThemes);
    }

    if (this.chart !== undefined) {
      this.chart.dispose();
    }

    this.chart = am4core.createFromConfig(
      event.chartConfig, 
      document.getElementById("chartdiv")
    );
  }

  applyChartThemes(themes) {
    am4core.unuseAllThemes();

    // just a sampling of applying a couple of themes
    if (themes) {
      themes.forEach(t => {
        // eslint-disable-next-line default-case
        switch (t) {
          case 'am4themes_animated': {
            am4core.useTheme(am4themes_animated);
            break;
          }
          case 'am4themes_dark': {
            am4core.useTheme(am4themes_dark);
            break;
          }
        }
      });
    }

    // get background color from applied themes
    const interfaceColors = new am4core.InterfaceColorSet();
    this.previewBackgroundColor = interfaceColors.getFor('background').hex;
  }

  componentWillUnmount() {
    if (this.chart !== undefined) {
      // cleanup after ourselves
      this.chart.dispose();
    }
  }


  render() {
    return (
      <div className="new-chart">
        <div className="page-intro">
          <h1>Create a brand new chart</h1>
          <p>
            Create a brand new chart from standard (included) templates.
          </p>
        </div>
        <div className="chartdiv" id="chartdiv" style={{backgroundColor: this.previewBackgroundColor}}>
          <div className="placeholder" onClick={this.launchEditor}>click here to create a new chart</div>
        </div>
        <div className="comments">
          <h2>Comments</h2>
          <p>Built-in (bundled) templates are disabled by default so the user doesn't get access 
            to them by simply refreshing the browser window (when used with 'window' target type).
            To enable built-in (bundled) templates set <code>editorConfig.allowDefaultTemplates = true</code> in the launcher configuration.</p>
        </div>
      </div>
    );
  }
}

export default NewChart;
