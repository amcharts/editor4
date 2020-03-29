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

const customTemplates: am4editor.ITemplateGroup[] = [{
  "name": "Our templates",
  "templates": [
    {
      "id": "line-chart",
      "displayName": "Line chart",
      "config": {
          "type": "XYChart",
          "data": [{
              "category": "Category #1",
              "value": 428
          }, {
              "category": "Category #2",
              "value": 467
          }, {
              "category": "Category #3",
              "value": 300
          }, {
              "category": "Category #4",
              "value": 413
          }, {
              "category": "Category #5",
              "value": 341
          }, {
              "category": "Category #6",
              "value": 321
          }, {
              "category": "Category #7",
              "value": 307
          }, {
              "category": "Category #8",
              "value": 393
          }],
          "xAxes": [{
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
          "yAxes": [{
              "type": "ValueAxis",
              "renderer": {
                  "maxLabelPosition": 0.98
              }
          }],
          "series": [{
              "type": "LineSeries",
              "bullets": {
                  "values": [{
                      "type": "CircleBullet",
                      "tooltipText": "{categoryX}\n{valueY}"
                  }],
                  "template": {
                      "type": "Bullet"
                  }
              },
              "dataFields": {
                  "valueY": "value",
                  "categoryX": "category"
              },
              "sequencedInterpolation": true,
              "sequencedInterpolationDelay": 100
          }]
      }
    }, {
      "id": "two-line-series",
      "displayName": "Two line series",
      "config": {
          "type": "XYChart",
          "data": [{
              "category": "Category #1",
              "value1": 207,
              "value2": 403
          }, {
              "category": "Category #2",
              "value1": 362,
              "value2": 274
          }, {
              "category": "Category #3",
              "value1": 384,
              "value2": 394
          }, {
              "category": "Category #4",
              "value1": 294,
              "value2": 331
          }, {
              "category": "Category #5",
              "value1": 417,
              "value2": 395
          }, {
              "category": "Category #6",
              "value1": 331,
              "value2": 310
          }, {
              "category": "Category #7",
              "value1": 222,
              "value2": 344
          }, {
              "category": "Category #8",
              "value1": 230,
              "value2": 335
          }],
          "xAxes": [{
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
          "yAxes": [{
              "type": "ValueAxis",
              "renderer": {
                  "maxLabelPosition": 0.98
              }
          }],
          "series": [{
              "type": "LineSeries",
              "name": "Series 1",
              "bullets": {
                  "values": [{
                      "type": "CircleBullet",
                      "tooltipText": "{name}\n{categoryX}: {valueY}"
                  }],
                  "template": {
                      "type": "Bullet"
                  }
              },
              "dataFields": {
                  "valueY": "value1",
                  "categoryX": "category"
              },
              "sequencedInterpolation": true,
              "sequencedInterpolationDelay": 100
          }, {
              "type": "LineSeries",
              "name": "Series 2",
              "bullets": {
                  "values": [{
                      "type": "Bullet",
                      "children": [{
                          "type": "Rectangle",
                          "width": "10",
                          "height": "10",
                          "horizontalCenter": "middle",
                          "verticalCenter": "middle"
                      }],
                      "tooltipText": "{name}\n{categoryX}: {valueY}"
                  }],
                  "template": {
                      "type": "Bullet"
                  }
              },
              "dataFields": {
                  "valueY": "value2",
                  "categoryX": "category"
              },
              "sequencedInterpolation": true,
              "sequencedInterpolationDelay": 100
          }]
      }
    }, {
      "id": "step-line-chart",
      "displayName": "Step line chart",
      "config": {
          "type": "XYChart",
          "data": [{
              "category": "Category #1",
              "value": 478
          }, {
              "category": "Category #2",
              "value": 345
          }, {
              "category": "Category #3",
              "value": 328
          }, {
              "category": "Category #4",
              "value": 495
          }, {
              "category": "Category #5",
              "value": 438
          }, {
              "category": "Category #6",
              "value": 382
          }, {
              "category": "Category #7",
              "value": 428
          }, {
              "category": "Category #8",
              "value": 380
          }, {
              "category": "Category #9",
              "value": 383
          }, {
              "category": "Category #10",
              "value": 451
          }, {
              "category": "Category #11",
              "value": 410
          }, {
              "category": "Category #12",
              "value": 494
          }, {
              "category": "Category #13",
              "value": 368
          }, {
              "category": "Category #14",
              "value": 407
          }, {
              "category": "Category #15",
              "value": 353
          }, {
              "category": "Category #16",
              "value": 406
          }, {
              "category": "Category #17",
              "value": 467
          }, {
              "category": "Category #18",
              "value": 324
          }, {
              "category": "Category #19",
              "value": 497
          }, {
              "category": "Category #20",
              "value": 467
          }, {
              "category": "Category #21",
              "value": 453
          }, {
              "category": "Category #22",
              "value": 489
          }, {
              "category": "Category #23",
              "value": 327
          }, {
              "category": "Category #24",
              "value": 451
          }, {
              "category": "Category #25",
              "value": 419
          }, {
              "category": "Category #26",
              "value": 322
          }, {
              "category": "Category #27",
              "value": 306
          }, {
              "category": "Category #28",
              "value": 466
          }, {
              "category": "Category #29",
              "value": 307
          }, {
              "category": "Category #30",
              "value": 377
          }],
          "xAxes": [{
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
                  "minGridDistance": 70
              }
          }],
          "yAxes": [{
              "type": "ValueAxis",
              "renderer": {
                  "maxLabelPosition": 0.98
              }
          }],
          "series": [{
              "type": "StepLineSeries",
              "dataFields": {
                  "valueY": "value",
                  "categoryX": "category"
              },
              "strokeWidth": 2,
              "sequencedInterpolation": true,
              "sequencedInterpolationDelay": 100,
              "tooltipText": "{categoryX}: {valueY}"
          }],
          "cursor": {
              "type": "XYCursor"
          }
      }
    }
  ]
}];

@Component({
  selector: 'app-edit-chart-type',
  templateUrl: './edit-chart-type.component.html',
  styleUrls: ['./edit-chart-type.component.css']
})
export class EditChartTypeComponent {
  chart?: am4core.Sprite;
  launcher?: am4editor.EditorLauncher;
  previewBackgroundColor = 'white';

  @Input() launcherSettings!: am4editor.ILauncherConfig;
  @Input() editorConfig!: am4editor.IConfig;

  ngAfterViewInit() {
    this.renderChart(chartConfig);
  }

  launchEditor() {
    this.launcher = new am4editor.EditorLauncher(this.launcherSettings);

    this.launcher.addEventListener('save', (event) => this.okClicked(event));
    this.launcher.addEventListener('close', () => {
      if (this.launcher) {
        this.launcher.close();
      }
    });

    // create a copy of global editor config so we don't modify it
    const editorConfig: am4editor.IConfig = JSON.parse(JSON.stringify(this.editorConfig));
    editorConfig.enabledModules = ['design', 'home'];
    editorConfig.templates = customTemplates;
    editorConfig.presetData = {
      data: [{
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
      templatePropertyMap: new Map([
        ['category', 'category'],
        ['value', 'value1'],
        ['value1', 'value1'],
        ['value2', 'value2']
      ])
    };
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
      this.renderChart(event.chartConfig, event.appliedThemes);
    }
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
      "chartdiv-edit-chart-type");
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
