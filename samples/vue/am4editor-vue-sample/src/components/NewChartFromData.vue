<template>
  <div class="new-chart">
    <div class="page-intro">
      <h1>Create a new chart from data</h1>
      <p>
        Create a new chart based on the data we supply.
      </p>
    </div>
    <div class="chartdiv" ref="chartdiv" :style="{ backgroundColor: previewBackgroundColor }">
      <div class="placeholder" @click="launchEditor">click here to create a new chart</div>
    </div>
    <div class="comments">
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
import { EditorLauncher, ILauncherConfig } from '@amcharts/editor4';

@Component
export default class NewChart extends Vue {
  chart?: am4core.Sprite;
  launcher?: EditorLauncher;
  previewBackgroundColor = 'white';

  @Prop() launcherSettings!: ILauncherConfig;

  launchEditor() {
    this.launcher = new EditorLauncher();

    // create a copy of global launcherSettings so we don't modify them
    const config = JSON.parse(JSON.stringify(this.launcherSettings)) as ILauncherConfig;
    config.editorConfig.enabledModules = ['design', 'home'];
    config.editorConfig.allowDefaultTemplates = true;
    config.editorConfig.presetData = {
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
    config.okCallback = this.renderChart;
    config.cancelCallback = () => { 
      if (this.launcher) {
        this.launcher.close(); 
      }
    };

    this.launcher.launch(config);
  }

  renderChart(chartConfig: object, appliedThemes?: string[]) {
    if (this.launcher) {
      this.launcher.close();
    }

    if (appliedThemes) {
      this.applyChartThemes(appliedThemes);
    }

    if (this.chart !== undefined) {
      this.chart.dispose();
    }

    this.chart = am4core.createFromConfig(chartConfig, this.$refs.chartdiv as HTMLElement);
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
