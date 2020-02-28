<template>
  <div class="edit-chart">
    <div class="page-intro">
      <h1>Edit chart</h1>
      <p>
        Edit an existing chart properties and/or data.
      </p>
      <p>
        <button class="launch-editor-button" @click="launchEditor">edit chart</button>
      </p>
    </div>
    <div class="chartdiv" ref="chartdiv" :style="{ backgroundColor: previewBackgroundColor }">
    </div>
    <div class="comments">
      <h2>Comments</h2>
      <p>In this sample we edit an already existing chart:</p>
      <ul>
        <li>We override global settings and make sure that <i>only</i> <code>design</code> and <code>data</code> modules are available;</li>
        <li>We remove <code>availableThemes</code> as we are not allowing theme changes;</li>
        <li>And we pass initial chart configuration that we want to edit and then store the resulting config back.</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// import amCharts
import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as am4charts from '@amcharts/amcharts4/charts';
import '@amcharts/amcharts4/charts'; // "hack" to prevent charts from being optimized-out as unused
// import themes
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

// import Editor Launcher
import { EditorLauncher, ILauncherConfig } from '@amcharts/am4editor';

let chartConfig: object = {
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

@Component
export default class EditChart extends Vue {
  chart?: am4core.Sprite;
  launcher?: EditorLauncher;
  previewBackgroundColor = 'white';

  @Prop() launcherSettings!: ILauncherConfig;

  mounted() {
    this.renderChart(chartConfig);
  }

  launchEditor() {
    this.launcher = new EditorLauncher();

    // create a copy of global launcherSettings so we don't modify them
    const config = JSON.parse(JSON.stringify(this.launcherSettings)) as ILauncherConfig;
    config.editorConfig.enabledModules = ['design', 'data'];
    if (config.editorConfig.engineConfig) {
      // remove themes as we are not allowning and not reacting to theme changes
      config.editorConfig.engineConfig.availableThemes = [];
    }
    config.editorConfig.chartConfig = chartConfig;
    console.log(config.editorConfig.chartConfig);
    config.okCallback = this.okClicked;
    config.cancelCallback = () => { 
      if (this.launcher) {
        this.launcher.close(); 
      }
    };

    this.launcher.launch(config);
  }

  okClicked(config: object) {
    chartConfig = config;
    this.renderChart(config);
  }

  renderChart(config: object, appliedThemes?: string[]) {
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
      this.$refs.chartdiv as HTMLElement);
  }

  applyChartThemes(themes: string[]) {
    am4core.unuseAllThemes();

    // just a sampling of applying a couple of themes
    if (themes) {
      themes.forEach(t => {
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

  beforeDestroy() {
    if (this.chart !== undefined) {
      // cleanup after ourselves
      this.chart.dispose();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
