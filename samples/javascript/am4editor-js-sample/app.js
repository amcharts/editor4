// demo plumbing
const appPages = [
  'home',
  'newChart',
  'editChart',
  'newChartFromData',
  'editChartType',
  'settings'
];
let currentPage = 'home';

let launcher;
let chart;

// default launcher settings
const launcherSettings = {
  editorUrl: 'https://editor4.amcharts.com/am4editor',
  target: { type: 'inline' }
};

// global and default editor settings
const globalEditorConfig = {
  enabledModules: ['home', 'design', 'data', 'code'],
  engineConfig: {
    availableThemes: [
      {
        name: 'am4themes_animated',
        label: 'Animated'
      },
      {
        name: 'am4themes_dark',
        label: 'Dark'
      }
    ]
  }
};

// sample chart configuration for editing demos
let editChartConfig = {
  type: 'XYChart',
  data: [
    {
      category: 'One',
      value1: 1124,
      value2: 1117
    },
    {
      category: 'Two',
      value1: 1712,
      value2: 2294
    },
    {
      category: 'Three',
      value1: 1350,
      value2: 1099
    },
    {
      category: 'Four',
      value1: 4433,
      value2: 2784
    },
    {
      category: 'Five',
      value1: 3884,
      value2: 4623
    },
    {
      category: 'Six',
      value1: 3777,
      value2: 4472
    },
    {
      category: 'Seven',
      value1: 3132,
      value2: 4578
    },
    {
      category: 'Eight',
      value1: 1115,
      value2: 673
    }
  ],
  xAxes: [
    {
      type: 'ValueAxis',
      renderer: {
        maxLabelPosition: 0.98
      }
    }
  ],
  yAxes: [
    {
      type: 'CategoryAxis',
      dataFields: {
        category: 'category'
      },
      renderer: {
        grid: {
          template: {
            type: 'Grid',
            location: 0
          }
        },
        minGridDistance: 20
      }
    }
  ],
  series: [
    {
      type: 'ColumnSeries',
      name: 'Series 1',
      columns: {
        template: {
          type: 'Column',
          strokeOpacity: 0,
          tooltipText: '{categoryY}\n{valueX}'
        }
      },
      dataFields: {
        valueX: 'value1',
        categoryY: 'category'
      },
      sequencedInterpolation: true,
      sequencedInterpolationDelay: 100
    },
    {
      type: 'ColumnSeries',
      name: 'Series 2',
      columns: {
        template: {
          type: 'Column',
          strokeOpacity: 0,
          tooltipText: '{categoryY}\n{valueX}'
        }
      },
      dataFields: {
        valueX: 'value2',
        categoryY: 'category'
      },
      sequencedInterpolation: true,
      sequencedInterpolationDelay: 100
    }
  ]
};

// sample custom templates for "Edit chart type" demo
const customTemplates = [
  {
    name: 'Our templates',
    templates: [
      {
        id: 'line-chart',
        displayName: 'Line chart',
        config: {
          type: 'XYChart',
          data: [
            {
              category: 'Category #1',
              value: 428
            },
            {
              category: 'Category #2',
              value: 467
            },
            {
              category: 'Category #3',
              value: 300
            },
            {
              category: 'Category #4',
              value: 413
            },
            {
              category: 'Category #5',
              value: 341
            },
            {
              category: 'Category #6',
              value: 321
            },
            {
              category: 'Category #7',
              value: 307
            },
            {
              category: 'Category #8',
              value: 393
            }
          ],
          xAxes: [
            {
              type: 'CategoryAxis',
              dataFields: {
                category: 'category'
              },
              renderer: {
                grid: {
                  template: {
                    type: 'Grid',
                    location: 0
                  }
                },
                minGridDistance: 20
              }
            }
          ],
          yAxes: [
            {
              type: 'ValueAxis',
              renderer: {
                maxLabelPosition: 0.98
              }
            }
          ],
          series: [
            {
              type: 'LineSeries',
              bullets: {
                values: [
                  {
                    type: 'CircleBullet',
                    tooltipText: '{categoryX}\n{valueY}'
                  }
                ],
                template: {
                  type: 'Bullet'
                }
              },
              dataFields: {
                valueY: 'value',
                categoryX: 'category'
              },
              sequencedInterpolation: true,
              sequencedInterpolationDelay: 100
            }
          ]
        }
      },
      {
        id: 'two-line-series',
        displayName: 'Two line series',
        config: {
          type: 'XYChart',
          data: [
            {
              category: 'Category #1',
              value1: 207,
              value2: 403
            },
            {
              category: 'Category #2',
              value1: 362,
              value2: 274
            },
            {
              category: 'Category #3',
              value1: 384,
              value2: 394
            },
            {
              category: 'Category #4',
              value1: 294,
              value2: 331
            },
            {
              category: 'Category #5',
              value1: 417,
              value2: 395
            },
            {
              category: 'Category #6',
              value1: 331,
              value2: 310
            },
            {
              category: 'Category #7',
              value1: 222,
              value2: 344
            },
            {
              category: 'Category #8',
              value1: 230,
              value2: 335
            }
          ],
          xAxes: [
            {
              type: 'CategoryAxis',
              dataFields: {
                category: 'category'
              },
              renderer: {
                grid: {
                  template: {
                    type: 'Grid',
                    location: 0
                  }
                },
                minGridDistance: 20
              }
            }
          ],
          yAxes: [
            {
              type: 'ValueAxis',
              renderer: {
                maxLabelPosition: 0.98
              }
            }
          ],
          series: [
            {
              type: 'LineSeries',
              name: 'Series 1',
              bullets: {
                values: [
                  {
                    type: 'CircleBullet',
                    tooltipText: '{name}\n{categoryX}: {valueY}'
                  }
                ],
                template: {
                  type: 'Bullet'
                }
              },
              dataFields: {
                valueY: 'value1',
                categoryX: 'category'
              },
              sequencedInterpolation: true,
              sequencedInterpolationDelay: 100
            },
            {
              type: 'LineSeries',
              name: 'Series 2',
              bullets: {
                values: [
                  {
                    type: 'Bullet',
                    children: [
                      {
                        type: 'Rectangle',
                        width: '10',
                        height: '10',
                        horizontalCenter: 'middle',
                        verticalCenter: 'middle'
                      }
                    ],
                    tooltipText: '{name}\n{categoryX}: {valueY}'
                  }
                ],
                template: {
                  type: 'Bullet'
                }
              },
              dataFields: {
                valueY: 'value2',
                categoryX: 'category'
              },
              sequencedInterpolation: true,
              sequencedInterpolationDelay: 100
            }
          ]
        }
      },
      {
        id: 'step-line-chart',
        displayName: 'Step line chart',
        config: {
          type: 'XYChart',
          data: [
            {
              category: 'Category #1',
              value: 478
            },
            {
              category: 'Category #2',
              value: 345
            },
            {
              category: 'Category #3',
              value: 328
            },
            {
              category: 'Category #4',
              value: 495
            },
            {
              category: 'Category #5',
              value: 438
            },
            {
              category: 'Category #6',
              value: 382
            },
            {
              category: 'Category #7',
              value: 428
            },
            {
              category: 'Category #8',
              value: 380
            },
            {
              category: 'Category #9',
              value: 383
            },
            {
              category: 'Category #10',
              value: 451
            },
            {
              category: 'Category #11',
              value: 410
            },
            {
              category: 'Category #12',
              value: 494
            },
            {
              category: 'Category #13',
              value: 368
            },
            {
              category: 'Category #14',
              value: 407
            },
            {
              category: 'Category #15',
              value: 353
            },
            {
              category: 'Category #16',
              value: 406
            },
            {
              category: 'Category #17',
              value: 467
            },
            {
              category: 'Category #18',
              value: 324
            },
            {
              category: 'Category #19',
              value: 497
            },
            {
              category: 'Category #20',
              value: 467
            },
            {
              category: 'Category #21',
              value: 453
            },
            {
              category: 'Category #22',
              value: 489
            },
            {
              category: 'Category #23',
              value: 327
            },
            {
              category: 'Category #24',
              value: 451
            },
            {
              category: 'Category #25',
              value: 419
            },
            {
              category: 'Category #26',
              value: 322
            },
            {
              category: 'Category #27',
              value: 306
            },
            {
              category: 'Category #28',
              value: 466
            },
            {
              category: 'Category #29',
              value: 307
            },
            {
              category: 'Category #30',
              value: 377
            }
          ],
          xAxes: [
            {
              type: 'CategoryAxis',
              dataFields: {
                category: 'category'
              },
              renderer: {
                grid: {
                  template: {
                    type: 'Grid',
                    location: 0
                  }
                },
                minGridDistance: 70
              }
            }
          ],
          yAxes: [
            {
              type: 'ValueAxis',
              renderer: {
                maxLabelPosition: 0.98
              }
            }
          ],
          series: [
            {
              type: 'StepLineSeries',
              dataFields: {
                valueY: 'value',
                categoryX: 'category'
              },
              strokeWidth: 2,
              sequencedInterpolation: true,
              sequencedInterpolationDelay: 100,
              tooltipText: '{categoryX}: {valueY}'
            }
          ],
          cursor: {
            type: 'XYCursor'
          }
        }
      }
    ]
  }
];

// sets the background color of the chart blocks (based on chart's theme)
function setPreviewBackground(color) {
  document.getElementById(
    currentPage + 'ChartDiv'
  ).style.backgroundColor = color;
}

// applies selected chart themes
function applyChartThemes(themes) {
  // eslint-disable-next-line no-undef
  am4core.unuseAllThemes();

  // just a sampling of applying a couple of themes
  if (themes) {
    themes.forEach(t => {
      // eslint-disable-next-line default-case
      switch (t) {
        case 'am4themes_animated': {
          // eslint-disable-next-line no-undef
          am4core.useTheme(am4themes_animated);
          break;
        }
        case 'am4themes_dark': {
          // eslint-disable-next-line no-undef
          am4core.useTheme(am4themes_dark);
          break;
        }
      }
    });
  }

  // get background color from applied themes
  // eslint-disable-next-line no-undef
  const interfaceColors = new am4core.InterfaceColorSet();
  setPreviewBackground(interfaceColors.getFor('background').hex);
}

// render chart in the preview area of an active "page"
function renderChart(chartConfig, appliedThemes) {
  if (launcher) {
    launcher.close();
  }

  if (appliedThemes) {
    applyChartThemes(appliedThemes);
  }

  if (chart !== undefined) {
    chart.dispose();
  }

  // eslint-disable-next-line no-undef
  this.chart = am4core.createFromConfig(
    JSON.parse(JSON.stringify(chartConfig)),
    document.getElementById(currentPage + 'ChartDiv')
  );
}

// handle data returned from the editor
function okClicked(event) {
  editChartConfig = event.chartConfig;
  renderChart(event.chartConfig, event.appliedThemes);
}

// launch the Editor with specified settings and chart config (if applicable)
function launchEditor(editorConfig, chartConfig) {
  // eslint-disable-next-line no-undef
  launcher = new am4editor.EditorLauncher(launcherSettings);

  launcher.addEventListener('save', okClicked);
  launcher.addEventListener('close', () => {
    if (launcher) {
      launcher.close();
    }
  });

  launcher.editorConfig = editorConfig;

  launcher.launch(chartConfig);
}

// launcher setup for the "New chart" demo
function launchNewChartEditor() {
  // create a copy of global editor config so we don't modify it
  const editorConfig = JSON.parse(JSON.stringify(globalEditorConfig));
  editorConfig.allowDefaultTemplates = true;

  launchEditor(editorConfig);
}

// launcher setup for the "Edit chart" demo
function launchEditChartEditor() {
  // create a copy of global editor config so we don't modify it
  const editorConfig = JSON.parse(JSON.stringify(globalEditorConfig));
  editorConfig.enabledModules = ['design', 'data'];
  if (editorConfig.engineConfig) {
    // remove themes as we are not allowning and not reacting to theme changes
    editorConfig.engineConfig.availableThemes = [];
  }
  launchEditor(editorConfig, editChartConfig);
}

// launcher setup for the "New chart from data" demo
function launchNewChartFromDataEditor() {
  // create a copy of global editor config so we don't modify it
  const editorConfig = JSON.parse(JSON.stringify(globalEditorConfig));
  editorConfig.enabledModules = ['design', 'home'];
  editorConfig.allowDefaultTemplates = true;
  editorConfig.presetData = {
    data: [
      { cat: 'c1', val: 10, val2: 21 },
      { cat: 'c2', val: 20, val2: 10 },
      { cat: 'c3', val: 40, val2: 14 },
      { cat: 'c4', val: 18, val2: 28 }
    ],
    templatePropertyMap: new Map([
      ['category', 'cat'],
      ['value', 'val'],
      ['value1', 'val'],
      ['value2', 'val']
    ])
  };
  launchEditor(editorConfig);
}

// launcher setup for the "Edit chart type" demo
function launchEditChartTypeEditor() {
  // create a copy of global editor config so we don't modify it
  const editorConfig = JSON.parse(JSON.stringify(globalEditorConfig));
  editorConfig.enabledModules = ['design', 'home'];
  editorConfig.templates = customTemplates;
  editorConfig.presetData = {
    data: [
      {
        category: 'One',
        value1: 1124,
        value2: 1117
      },
      {
        category: 'Two',
        value1: 1712,
        value2: 2294
      },
      {
        category: 'Three',
        value1: 1350,
        value2: 1099
      },
      {
        category: 'Four',
        value1: 4433,
        value2: 2784
      },
      {
        category: 'Five',
        value1: 3884,
        value2: 4623
      },
      {
        category: 'Six',
        value1: 3777,
        value2: 4472
      },
      {
        category: 'Seven',
        value1: 3132,
        value2: 4578
      },
      {
        category: 'Eight',
        value1: 1115,
        value2: 673
      }
    ],
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

  launchEditor(editorConfig, editChartConfig);
}

// switch demo "pages"
function switchPage(page) {
  appPages.forEach(p => {
    if (p === page) {
      document.getElementById(p).style.display = 'block';
      currentPage = p;
    } else {
      document.getElementById(p).style.display = 'none';
    }
  });

  if (page === 'editChart' || page === 'editChartType') {
    renderChart(editChartConfig);
  }
}

// hook-up event listeners on page load
window.addEventListener('DOMContentLoaded', () => {
  appPages.forEach(pid => {
    document
      .getElementById(pid + 'Menu')
      .addEventListener('click', () => switchPage(pid));
  });

  // add editor launchers
  document
    .getElementById('newChartPlaceholder')
    .addEventListener('click', () => {
      launchNewChartEditor();
    });
  document.getElementById('editChartButton').addEventListener('click', () => {
    launchEditChartEditor();
  });
  document
    .getElementById('newChartFromDataPlaceholder')
    .addEventListener('click', () => {
      launchNewChartFromDataEditor();
    });
  document
    .getElementById('editChartTypeButton')
    .addEventListener('click', () => {
      launchEditChartTypeEditor();
    });

  // setup setting switching
  document.getElementsByName('target-type').forEach(target => {
    target.addEventListener('click', event => {
      launcherSettings.target.type = event.target.value;
    });
  });

  document.getElementsByName('enabled-module').forEach(el => {
    el.addEventListener('click', () => {
      globalEditorConfig.enabledModules.splice(0);
      document.getElementsByName('enabled-module').forEach(module => {
        if (module.checked) {
          globalEditorConfig.enabledModules.push(module.value);
        }
      });
    });
  });

  document.getElementsByName('enabled-theme').forEach(el => {
    el.addEventListener('click', () => {
      globalEditorConfig.engineConfig.availableThemes.splice(0);
      document.getElementsByName('enabled-theme').forEach(theme => {
        if (theme.checked) {
          globalEditorConfig.engineConfig.availableThemes.push({
            name: theme.value,
            label: theme.value.substring(theme.value.indexOf('_') + 1)
          });
        }
      });
    });
  });
});
