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

let chartConfig = {
  "type": "XYChart",
  "data": [{
      "category": "One",
      "value1": 1124,
      "value2": 1117
  }, {
      "category": "Two",
      "value1": 1712,
      "value2": 2294
  }, {
      "category": "Three",
      "value1": 1350,
      "value2": 1099
  }, {
      "category": "Four",
      "value1": 4433,
      "value2": 2784
  }, {
      "category": "Five",
      "value1": 3884,
      "value2": 4623
  }, {
      "category": "Six",
      "value1": 3777,
      "value2": 4472
  }, {
      "category": "Seven",
      "value1": 3132,
      "value2": 4578
  }, {
      "category": "Eight",
      "value1": 1115,
      "value2": 673
  }],
  "xAxes": [{
      "type": "ValueAxis",
      "renderer": {
          "maxLabelPosition": 0.98
      }
  }],
  "yAxes": [{
      "type": "CategoryAxis",
      "dataFields": {
          "category": "category"
      },
      "renderer": {
          "grid": {
              "template": {
                  "type": "Grid",
                  "location": 0
              }
          },
          "minGridDistance": 20
      }
  }],
  "series": [{
      "type": "ColumnSeries",
      "name": "Series 1",
      "columns": {
          "template": {
              "type": "Column",
              "strokeOpacity": 0,
              "tooltipText": "{categoryY}\n{valueX}"
          }
      },
      "dataFields": {
          "valueX": "value1",
          "categoryY": "category"
      },
      "sequencedInterpolation": true,
      "sequencedInterpolationDelay": 100
  }, {
      "type": "ColumnSeries",
      "name": "Series 2",
      "columns": {
          "template": {
              "type": "Column",
              "strokeOpacity": 0,
              "tooltipText": "{categoryY}\n{valueX}"
          }
      },
      "dataFields": {
          "valueX": "value2",
          "categoryY": "category"
      },
      "sequencedInterpolation": true,
      "sequencedInterpolationDelay": 100
  }]
};


class EditChart extends Component {
  chart;
  launcher;
  previewBackgroundColor = 'white';

  constructor(props) {
    super(props);
    this.launchEditor = this.launchEditor.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.applyChartThemes = this.applyChartThemes.bind(this);
    this.okClicked = this.okClicked.bind(this);
  }

  componentDidMount() {
    this.renderChart(chartConfig);
  }

  launchEditor() {
    this.launcher = new am4editor.EditorLauncher(this.props.launcherSettings);

    this.launcher.addEventListener('save', this.okClicked);
    this.launcher.addEventListener('close', () => { 
      if (this.launcher) {
        this.launcher.close(); 
      }
    });

    // create a copy of global editor config so we don't modify it
    const editorConfig = JSON.parse(JSON.stringify(this.props.editorConfig));
    editorConfig.enabledModules = ['design', 'data'];
    if (editorConfig.engineConfig) {
      // remove themes as we are not allowning and not reacting to theme changes
      editorConfig.engineConfig.availableThemes = [];
    }

    this.launcher.editorConfig = editorConfig;

    this.launcher.launch(chartConfig);
  }

  okClicked(event) {
    chartConfig = event.chartConfig;
    this.renderChart(event.chartConfig);
  }

  renderChart(config, appliedThemes) {
    if (this.launcher) {
      this.launcher.close();
    }

    if (appliedThemes) {
      this.applyChartThemes(appliedThemes);
    }

    if (this.chart !== undefined) {
      this.chart.dispose();
    }

    this.chart = am4core.createFromConfig(
      // have to create a copy of config cause createFromConfig will mutate it
      JSON.parse(JSON.stringify(config)), 
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
      <div className="edit-chart">
        <div className="page-intro">
          <h1>Edit chart</h1>
          <p>
            Edit an existing chart properties and/or data.
          </p>
          <p>
            <button className="launch-editor-button" onClick={this.launchEditor}>edit chart</button>
          </p>
        </div>
        <div className="chartdiv" id="chartdiv" style={{ backgroundColor: this.previewBackgroundColor }}>
        </div>
        <div className="comments">
          <h2>Comments</h2>
          <p>In this sample we edit an already existing chart:</p>
          <ul>
            <li>We override global settings and make sure that <i>only</i> <code>design</code> and <code>data</code> modules are available;</li>
            <li>We remove <code>availableThemes</code> as we are not allowing theme changes;</li>
            <li>And we pass initial chart configuration that we want to edit and then store the resulting config back.</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default EditChart;
