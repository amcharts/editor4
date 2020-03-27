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

class NewChartFromData extends Component {
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
    editorConfig.enabledModules = ['design', 'home'];
    editorConfig.allowDefaultTemplates = true;
    editorConfig.presetData = {
      data: [
        { cat: 'c1', val: 10, val2: 21, },
        { cat: 'c2', val: 20, val2: 10, },
        { cat: 'c3', val: 40, val2: 14, },
        { cat: 'c4', val: 18, val2: 28, }
      ],
      templatePropertyMap: new Map([
        ['category', 'cat'],
        ['value', 'val'],
        ['value1', 'val'],
        ['value2', 'val']
      ])
    };
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
          <h1>Create a new chart from data</h1>
          <p>
            Create a new chart based on the data we supply.
          </p>
        </div>
        <div className="chartdiv" id="chartdiv" style={{ backgroundColor: this.previewBackgroundColor }}>
          <div className="placeholder" onClick={this.launchEditor}>click here to create a new chart</div>
        </div>
        <div className="comments">
          <h2>Comments</h2>
          <p>In this demo we let users create a new chart based on the preset data we supply</p>
          <ul>
            <li>We override global settings so that only <code>home</code> and <code>design</code> modules are enabled;</li>
            <li>We supply our data via <code>presetData</code> config property;</li>
            <li>We configure the mapping between our data structure and standard template data fields (category, value, value1, value2, etc.)</li>
          </ul>
    
          <p>Note that our data set may have more or less data/values than some templates expect so it won't fit perfectly in all templates.
            In a real life scenario you would supply your own templates that match the shape of your data set.
          </p>
        </div>
      </div>
    );
  }
}

export default NewChartFromData;
