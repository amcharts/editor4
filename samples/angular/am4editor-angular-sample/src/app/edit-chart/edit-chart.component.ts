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

@Component({
  selector: 'app-edit-chart',
  templateUrl: './edit-chart.component.html',
  styleUrls: ['./edit-chart.component.css']
})
export class EditChartComponent {
	chart?: am4core.Sprite;
  launcher?: am4editor.EditorLauncher;
  previewBackgroundColor = 'white';

  @Input() launcherSettings: am4editor.ILauncherConfig;
  @Input() editorConfig: am4editor.IConfig;

  ngAfterViewInit() {
    this.renderChart({ chartConfig: chartConfig });
  }

  launchEditor() {
    this.launcher = new am4editor.EditorLauncher(this.launcherSettings);
    this.launcher.addEventListener('save', this.okClicked);
    this.launcher.addEventListener('close', () => {
      if (this.launcher) {
        this.launcher.close();
      }
    });

    // create a copy of global editor config so we don't modify it
    const editorConfig: am4editor.IConfig = JSON.parse(JSON.stringify(this.editorConfig));
    editorConfig.enabledModules = ['design', 'data'];
    if (editorConfig.engineConfig) {
      // remove themes as we are not allowning and not reacting to theme changes
      editorConfig.engineConfig.availableThemes = [];
    }

    this.launcher.editorConfig = editorConfig;

    this.launcher.launch(chartConfig);
  }

  okClicked(event?: am4editor.ILauncherEventArguments) {
    if (event) {
      chartConfig = event.chartConfig;
      this.renderChart(event);
    }
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

      this.chart = am4core.createFromConfig(
        // have to create a copy of config cause createFromConfig will mutate it
        JSON.parse(JSON.stringify(event.chartConfig)),
        "chartdiv-edit");
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
