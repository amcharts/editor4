import { Component, Input } from '@angular/core';

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
import * as am4editor from '@amcharts/editor4';

@Component({
  selector: 'app-new-chart-from-data',
  templateUrl: './new-chart-from-data.component.html',
  styleUrls: ['./new-chart-from-data.component.css']
})
export class NewChartFromDataComponent {
	chart?: am4core.Sprite;
  launcher?: am4editor.EditorLauncher;
  previewBackgroundColor = 'white';

  @Input() launcherSettings: am4editor.ILauncherConfig;
  @Input() editorConfig: am4editor.IConfig;

  launchEditor() {
    this.launcher = new am4editor.EditorLauncher(this.launcherSettings);

    this.launcher.addEventListener('save', this.renderChart);
    this.launcher.addEventListener('close', () => {
      if (this.launcher) {
        this.launcher.close();
      }
    });

    // create a copy of global editor config so we don't modify it
    const editorConfig: am4editor.IConfig = JSON.parse(JSON.stringify(this.editorConfig));
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

  renderChart(event?: am4editor.ILauncherEventArguments) {
    if (event) {
      if (this.launcher) {
        this.launcher.close();
      }

      if (event.appliedThemes) {
        this.applyChartThemes(event.appliedThemes);
      }

      if (this.chart !== undefined) {
        this.chart.dispose();
      }

      this.chart = am4core.createFromConfig(event.chartConfig, "chartdiv-new-from-data");
    }
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

  ngOnDestroy() {
    if (this.chart !== undefined) {
      // cleanup after ourselves
      this.chart.dispose();
    }
  }
}
