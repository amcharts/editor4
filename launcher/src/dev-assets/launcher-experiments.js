/* eslint-disable */
let launcher;
let chartConfig;

let am4editor_lang_ru = {
  ui: {
    "module_bar.design": "Дизайн"
  },
  common: {
    width: "Ширина"
  },
  properties: {
    "Label.text": "Текст"
  },


}

const templates = [
  {
    name: 'Basic templates',
    templates: [
      {
        id: 'basic-pie-chart',
        displayName: 'Basic Pie chart',
        config: {
          type: 'PieChart',
          series: [
            {
              type: 'PieSeries',
              dataFields: {
                value: 'quantity',
                category: 'country'
              }
            }
          ],
          data: [
            {
              country: 'Lithuania',
              quantity: 501.9
            },
            {
              country: 'Czech Republic',
              quantity: 301.9
            },
            {
              country: 'Ireland',
              quantity: 201.1
            }
          ]
        }
      },
      {
        id: 'basic-column-chart',
        displayName: 'Simple column chart',
        description: 'Create a basic column chart',
        previewSrc:
          'data:image/png;base64,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uyPeygv1mF8b371vbrgeKyeY//m8rwcAAACAFDq/QcIhapWx2LhpPTXoRdZsAzjfrNkGcL5Zsw2eX8fWbHuS8oLQBgAAAED/OZXYBgAAAAD9SGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIpNRsKb6mx33+9VbxFXTOvXv343vf+14MDLxUnIHOem3gYvEV0AsePHiQP1+5ciV/BuB82dzcbP1McC+uXbtWnAFOSmw7Q27+h4/jy61HUSqOoROy/5dQKvlfGZ239agZ/+t//XZcvTxQnAF6gdgGcL6JbfD8xLYz5IOPPo6H33xbHAGcbZcuXoiZ998S26DHiG0A55vYBs/Pmm0AAAAAkIjYBgAAAACJiG0AAAAAkIjYBgAAAACJiG0AAAAAkIjYBgAAAACJdC621SpRKpX2HpVaceFwtcoT7n2K93ri6wEAAACgCzoU2xpRnYtYbjajmT/qMb82Hkc1sEZ1LMZjubi32fpqPMaqjZ2rx77Xk18PAAAAAN1RamZ1qhuy0Wl3J6O5UC5O7KhFpXQ3JpsLsXulUY2xofW41X6u3b73eobXn1EffPRxPPzm2+II4Gy7dPFCzLz/Vly9PFCcAXrBgwcP8ucrV67kzwCcL5ubm3Hv3r24du1acQY4qa6t2dbYWIvR4cHiqE1jI9ZGh2PflcGJmBpdi40jBqfte69neD0AAAAAdEKXRrZlo8/mYri+EjMHe9uhI94aUR27EXHnkPsPvteJX/9kDx8+jC+++KI46i1/sf6b+HKrOwMRATrtpQsRf/p7A/HDl+3VA73ks88+y59ff/31/BmA82Vrays++eSTuHr1anEGzp9XX301Ll++XBydXOdjWz6lczZGlpvx2AzSzEli2WHvlTi2ff311/mw2V4099e/jF9vPiqOAM62gRdK8Wd/+Hq8/eqLxRmg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AAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIRGwDAAAAgETENgAAAABIpAuxrRHVsUrUiqPDZfeUolQqHpXH765Vnu86AAAAAHRaZ2NbrRKl0lDMrhbHh8pC21AsTdWj2Wzmj+UY3xfMGtWx1pnlfdfHqo3i6vHXAQAAAKAbOhfbGtUYG1+L+fpyTBenDtX4MJZWp+PWzGBxIqJ8cz5GF+8Wo+FqcXt2JJYXyvlRJrses7ef8joAAAAAdEfnYtvgTKw0V6KtoR2usR6PDXwbvB4jsRYb2eC0xkasjQ7HvrcZnIip0ae8DgAAAABdUmpm8y47qhaV0t2YbC7E3tizdtn18Vibr8dKUeay9dfGF0djvr4SM41KlO5ORrNt5FrkU09vRNx5iuvHxb4DNjc380cv+t/+8z/GrzcfFUcAZ9vAC6X4X0auxNuvvlicAXrBp59+mj+/8cYb+TMA50v28/D9+/fjvffeK87A+fPiiy/mj2fVA7Etsx3cFouj0fn5GJldiuFTiG1ffPFFfP7558VRb/nfNzbjy287/I8LoEteuhDxP7/3Yvzw5VJxBugFn332Wf78+uuv588AnC9bW1vxySefxNWrV4szcP689tprcfny5eLo5Hokth2Qrfc2tB63stdkX+fdbKZtqmhbTItjrp8wtvWyDz76OB5+821xBHC2Xbp4IWbefyuuXh4ozgC94MGDB/nzlStX8mcAzpdsZNu9e/fi2rVrxRngpDq7G+kzany4FKvTk9txLlu/bXU99i2/lm2qEFMxkYW0464DAAAAQJecTmzLRquVKnHobqG1SgzNRszf3BkHV47J6cUYr+zdXbvdumFqohjJdtx1AAAAAOiOU4pt63sj1/Ipn6UolYrHeMTygV1Mywv1mF8b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',
        config: {
          type: 'XYChart',
          data: [
            {
              category: 'Column 1',
              value: 2025
            },
            {
              category: 'Column 2',
              value: 1882
            },
            {
              category: 'Column 3',
              value: 1809
            }
          ],

          xAxes: [
            {
              type: 'CategoryAxis',
              dataFields: {
                category: 'category'
              }
            }
          ],

          yAxes: [
            {
              type: 'ValueAxis'
            }
          ],

          series: [
            {
              type: 'ColumnSeries',
              dataFields: {
                valueY: 'value',
                categoryX: 'category'
              }
            }
          ],

          titles: [
            {
              type: 'Label',
              text: 'Simple column chart'
            }
          ]
        }
      },
      {
        id: 'basic-radar-chart',
        displayName: 'Basic Radar chart',
        config: {
          type: 'RadarChart',
          data: [
            {
              country: 'Lithuania',
              litres: 501
            },
            {
              country: 'Czech Republic',
              litres: 301
            },
            {
              country: 'Ireland',
              litres: 266
            },
            {
              country: 'Germany',
              litres: 165
            },
            {
              country: 'Australia',
              litres: 139
            },
            {
              country: 'Austria',
              litres: 336
            },
            {
              country: 'UK',
              litres: 290
            },
            {
              country: 'Belgium',
              litres: 325
            },
            {
              country: 'The Netherlands',
              litres: 40
            }
          ],
          xAxes: [
            {
              type: 'CategoryAxis',
              dataFields: {
                category: 'country'
              }
            }
          ],
          yAxes: [
            {
              type: 'ValueAxis'
            }
          ],
          series: [
            {
              type: 'RadarSeries',
              name: 'Sales',
              dataFields: {
                valueY: 'litres',
                categoryX: 'country'
              }
            }
          ]
        }
      },
      {
        id: 'simple-bar-chart',
        displayName: 'Simple bar chart',
        config: {
          type: 'XYChart',
          // Reduce saturation of colors to make them appear as toned down
          colors: {
            saturation: 0.4
          },

          // Setting data
          data: [
            {
              country: 'USA',
              visits: 3025
            },
            {
              country: 'China',
              visits: 1882
            },
            {
              country: 'Japan',
              visits: 1809
            },
            {
              country: 'Germany',
              visits: 1322
            },
            {
              country: 'UK',
              visits: 1122
            },
            {
              country: 'France',
              visits: 1114
            },
            {
              country: 'India',
              visits: 984
            },
            {
              country: 'Spain',
              visits: 711
            },
            {
              country: 'Netherlands',
              visits: 665
            },
            {
              country: 'Russia',
              visits: 580
            },
            {
              country: 'South Korea',
              visits: 443
            },
            {
              country: 'Canada',
              visits: 441
            }
          ],

          // Add Y axis
          yAxes: [
            {
              type: 'CategoryAxis',
              renderer: {
                minGridDistance: 20,
                grid: {
                  location: 0
                }
              },
              dataFields: {
                category: 'country'
              }
            }
          ],

          // Add X axis
          xAxes: [
            {
              type: 'ValueAxis',
              renderer: {
                maxLabelPosition: 0.98
              }
            }
          ],

          // Add series
          series: [
            {
              // Set type
              type: 'ColumnSeries',

              // Define data fields
              dataFields: {
                categoryY: 'country',
                valueX: 'visits'
              },

              // Modify default state
              defaultState: {
                transitionDuration: 1000
              },

              // Set animation options
              sequencedInterpolation: true,
              sequencedInterpolationDelay: 100,

              // Modify color appearance
              columns: {
                // Disable outline
                strokeOpacity: 0

                // Add adapter to apply different colors for each column
                // adapter: {
                //   fill: function(fill, target) {
                //     return chart.colors.getIndex(target.dataItem.index);
                //   }
                // }
              }
            }
          ],

          // Enable chart cursor
          cursor: {
            type: 'XYCursor',
            behavior: 'zoomY'
          }
        }
      },
      {
        id: 'simple-gauge-chart',
        displayName: 'Simple Gauge chart',
        config: {
          type: 'GaugeChart',
          // Set inner radius
          innerRadius: -15,

          // Add axis
          xAxes: [
            {
              // Set axis type and settings
              type: 'ValueAxis',
              min: 0,
              max: 100,
              strictMinMax: true,

              // Add axis ranges
              axisRanges: [
                {
                  value: 0,
                  endValue: 50,
                  axisFill: {
                    fillOpacity: 1,
                    fill: '#67b7dc'
                  }
                },
                {
                  value: 50,
                  endValue: 80,
                  axisFill: {
                    fillOpacity: 1,
                    fill: '#6771dc'
                  }
                },
                {
                  value: 80,
                  endValue: 100,
                  axisFill: {
                    fillOpacity: 1,
                    fill: '#a367dc'
                  }
                }
              ]
            }
          ],

          // Add hand
          hands: [
            {
              type: 'ClockHand',
              id: 'h1'
            }
          ]
        }
      },
      {
        id: 'simple-date-line-chart',
        displayName: 'Simple Date-based Line chart',
        config: {
          type: 'XYChart',
          // Set settings and data
          paddingRight: 20,
          data: [
            { date: '2017-12-31T22:00:00.000Z', name: 'name1', value: 109 },
            { date: '2018-01-01T22:00:00.000Z', name: 'name2', value: 115 },
            { date: '2018-01-02T22:00:00.000Z', name: 'name3', value: 121 },
            { date: '2018-01-03T22:00:00.000Z', name: 'name4', value: 123 },
            { date: '2018-01-04T22:00:00.000Z', name: 'name5', value: 130 },
            { date: '2018-01-05T22:00:00.000Z', name: 'name6', value: 124 },
            { date: '2018-01-06T22:00:00.000Z', name: 'name7', value: 121 },
            { date: '2018-01-07T22:00:00.000Z', name: 'name8', value: 116 },
            { date: '2018-01-08T22:00:00.000Z', name: 'name9', value: 120 },
            { date: '2018-01-09T22:00:00.000Z', name: 'name10', value: 129 },
            { date: '2018-01-10T22:00:00.000Z', name: 'name11', value: 130 },
            { date: '2018-01-11T22:00:00.000Z', name: 'name12', value: 123 },
            { date: '2018-01-12T22:00:00.000Z', name: 'name13', value: 131 },
            { date: '2018-01-13T22:00:00.000Z', name: 'name14', value: 136 },
            { date: '2018-01-14T22:00:00.000Z', name: 'name15', value: 144 },
            { date: '2018-01-15T22:00:00.000Z', name: 'name16', value: 142 },
            { date: '2018-01-16T22:00:00.000Z', name: 'name17', value: 140 },
            { date: '2018-01-17T22:00:00.000Z', name: 'name18', value: 140 },
            { date: '2018-01-18T22:00:00.000Z', name: 'name19', value: 141 },
            { date: '2018-01-19T22:00:00.000Z', name: 'name20', value: 144 },
            { date: '2018-01-20T22:00:00.000Z', name: 'name21', value: 154 },
            { date: '2018-01-21T22:00:00.000Z', name: 'name22', value: 158 },
            { date: '2018-01-22T22:00:00.000Z', name: 'name23', value: 150 },
            { date: '2018-01-23T22:00:00.000Z', name: 'name24', value: 146 },
            { date: '2018-01-24T22:00:00.000Z', name: 'name25', value: 153 },
            { date: '2018-01-25T22:00:00.000Z', name: 'name26', value: 154 },
            { date: '2018-01-26T22:00:00.000Z', name: 'name27', value: 162 },
            { date: '2018-01-27T22:00:00.000Z', name: 'name28', value: 153 },
            { date: '2018-01-28T22:00:00.000Z', name: 'name29', value: 151 },
            { date: '2018-01-29T22:00:00.000Z', name: 'name30', value: 155 }
          ],

          // Create X axes
          xAxes: [
            {
              type: 'DateAxis',
              renderer: {
                grid: {
                  location: 0
                }
              }
            }
          ],

          // Create Y axes
          yAxes: [
            {
              type: 'ValueAxis',
              tooltip: {
                disabled: true
              },
              renderer: {
                minWidth: 35
              }
            }
          ],

          // Create series
          series: [
            {
              id: 's1',
              type: 'LineSeries',
              dataFields: {
                dateX: 'date',
                valueY: 'value'
              },
              tooltipText: '{valueY.value}'
            }
          ],

          // Add cursor
          cursor: {
            type: 'XYCursor'
          },

          // Add horizontal scrollbar
          scrollbarX: {
            type: 'XYChartScrollbar',
            series: ['s1']
          }
        }
      },
      {
        id: 'simple-pie-chart-rounded-corners',
        displayName: 'Simple Pie chart with rounded corners',
        config: {
          type: 'PieChart',
          // Set inner radius
          innerRadius: '40%',

          // Set data
          data: [
            {
              country: 'Lithuania',
              value: 401
            },
            {
              country: 'Czech Republic',
              value: 300
            },
            {
              country: 'Ireland',
              value: 200
            },
            {
              country: 'Germany',
              value: 165
            },
            {
              country: 'Australia',
              value: 139
            },
            {
              country: 'Austria',
              value: 128
            }
          ],

          // Create series
          series: [
            {
              type: 'PieSeries',
              dataFields: {
                value: 'value',
                category: 'country'
              },
              slices: {
                cornerRadius: 10,
                innerCornerRadius: 7
              },
              hiddenState: {
                properties: {
                  // this creates initial animation
                  opacity: 1,
                  endAngle: -90,
                  startAngle: -90
                }
              }
            }
          ],

          // Add legend
          legend: {}
        }
      },
      {
        id: 'simple-sankey-diagram',
        displayName: 'Simple Sankey Diagram',
        config: {
          type: 'SankeyDiagram',
          // Set data
          data: [
            { from: 'A', to: 'D', value: 10 },
            { from: 'B', to: 'D', value: 8 },
            { from: 'B', to: 'E', value: 4 },
            { from: 'C', to: 'E', value: 3 },
            { from: 'D', to: 'G', value: 5 },
            { from: 'D', to: 'I', value: 2 },
            { from: 'D', to: 'H', value: 3 },
            { from: 'E', to: 'H', value: 6 },
            { from: 'G', to: 'J', value: 5 },
            { from: 'I', to: 'J', value: 1 },
            { from: 'H', to: 'J', value: 9 }
          ],

          // Set data fields
          dataFields: {
            fromName: 'from',
            toName: 'to',
            value: 'value'
          },

          // Configure nodes
          nodes: {
            template: {
              draggable: true,
              inert: true,
              readerTitle: 'Drag me!',
              showSystemTooltip: true,
              width: 30,
              background: {
                defaultState: {
                  filters: [
                    {
                      type: 'DropShadowFilter',
                      opacity: 0
                    }
                  ]
                },
                hoverState: {
                  filters: [
                    {
                      type: 'DropShadowFilter',
                      dy: 0
                    }
                  ]
                }
              }
            }
          }
        }
      },
      {
        id: 'simple-treemap',
        displayName: 'Simpe Treemap',
        config: {
          type: 'TreeMap',
          // Set data
          data: [
            {
              name: 'First',
              children: [
                {
                  name: 'A1',
                  value: 100
                },
                {
                  name: 'A2',
                  value: 60
                },
                {
                  name: 'A3',
                  value: 30
                }
              ]
            },
            {
              name: 'Second',
              children: [
                {
                  name: 'B1',
                  value: 135
                },
                {
                  name: 'B2',
                  value: 98
                },
                {
                  name: 'B3',
                  value: 56
                }
              ]
            },
            {
              name: 'Third',
              children: [
                {
                  name: 'C1',
                  value: 335
                },
                {
                  name: 'C2',
                  value: 148
                },
                {
                  name: 'C3',
                  value: 126
                },
                {
                  name: 'C4',
                  value: 26
                }
              ]
            },
            {
              name: 'Fourth',
              children: [
                {
                  name: 'D1',
                  value: 415
                },
                {
                  name: 'D2',
                  value: 148
                },
                {
                  name: 'D3',
                  value: 89
                },
                {
                  name: 'D4',
                  value: 64
                },
                {
                  name: 'D5',
                  value: 16
                }
              ]
            },
            {
              name: 'Fifth',
              children: [
                {
                  name: 'E1',
                  value: 687
                },
                {
                  name: 'E2',
                  value: 148
                }
              ]
            }
          ],

          // Set settings
          colors: {
            step: 2
          },
          zoomable: false,
          maxLevels: 2,

          // Set up data fields
          dataFields: {
            value: 'value',
            name: 'name',
            children: 'children'
          },

          // Disable tooltip animation
          tooltip: {
            animationDuration: 0
          },

          // Set up series templates by level
          seriesTemplates: {
            '0': {
              columns: {
                column: {
                  cornerRadiusTopLeft: 10,
                  cornerRadiusTopRight: 10,
                  cornerRadiusBottomLeft: 10,
                  cornerRadiusBottomRight: 10
                },
                fillOpacity: 0,
                strokeWidth: 4,
                strokeOpacity: 0
              }
            },
            '1': {
              columns: {
                strokeOpacity: 1,
                column: {
                  cornerRadiusTopLeft: 10,
                  cornerRadiusTopRight: 10,
                  cornerRadiusBottomLeft: 10,
                  cornerRadiusBottomRight: 10
                },
                fillOpacity: 1,
                strokeWidth: 4,
                stroke: '#ffffff'
              },
              bullets: [
                {
                  type: 'LabelBullet',
                  locationX: 0.5,
                  locationY: 0.5,
                  label: {
                    text: '{name}',
                    fill: '#ffffff'
                  }
                }
              ]
            }
          }
        }
      }
    ]
  }
];

const engineConfig = {
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
};

let appliedThemes = [];
let licenseNumbers = [];

function getModules() {
  const result = [];
  const modules = document.getElementsByName('editorModule');
  modules.forEach(el => {
    if (el.checked) {
      result.push(el.value);
    }
  });
  return result.length > 0 ? result : undefined;
}

function closeEditor() {
  // const inIFrame = document.getElementById('inIFrame').checked;
  // if (inIFrame) {
  //   document.getElementById('editordiv').style.display = 'none';
  // }
  launcher.close();
}

function showChart(event) {
  chartConfig = event.chartConfig;
  appliedThemes = event.appliedThemes;
  licenseNumbers = event.appliedLicenses;

  am4core.unuseAllThemes();

  if (appliedThemes) {
    appliedThemes.forEach(t => {
      switch (t) {
        case 'am4themes_animated': {
          am4core.useTheme(am4themes_animated);
          break;
        }
        case 'am4themes_dark': {
          am4core.useTheme(am4themes_dark);
          break;
        }
        default: {
        }
      }
    });
  }

  if (licenseNumbers) {
    licenseNumbers.forEach(l => {
      am4core.addLicense(l);
    });
  }

  am4core.createFromConfig(JSON.parse(JSON.stringify(chartConfig)), 'chartdiv');
  document.getElementById('editChartButton').disabled = false;
  closeEditor();
}

function launchEditor(editMode) {
  const inIFrame = document.getElementById('inIFrame').checked;

  const launcherConfig = {
    editorUrl: 'http://localhost:3000/',
    
    target: {
      type: inIFrame ? 'inline' : 'window',
      // target: inIFrame ? 'editordiv' : '_blank',
      windowFeatures:
        'width=900,height=600,menubar=yes,location=no,resizable=yes,scrollbars=yes,status=yes'
    }
  };

  launcher = new am4editor.EditorLauncher(launcherConfig);

  launcher.addEventListener('save', showChart);
  launcher.addEventListener('close', closeEditor);

  launcher.editorConfig = {
      templates: document.getElementById('passTemplates').checked
        ? templates
        : undefined,
      enabledModules: getModules(),
      engineConfig: engineConfig,
      language: am4editor_lang_ru
      // @todo comment preset data test code
      // // test preset data functionality
      // presetData: {
      //   data: [
      //     { cat: 'c1', val: 10 },
      //     { cat: 'c2', val: 20 },
      //     { cat: 'c3', val: 40 },
      //     { cat: 'c4', val: 18 }
      //   ],
      //   templatePropertyMap: new Map([
      //     ['category', 'cat'],
      //     ['value', 'val'],
      //     ['value1', 'val']
      //   ])
      // }
  };

  if (editMode) {
    launcher.editorConfig.engineConfig.appliedThemes = appliedThemes;
    launcher.editorConfig.engineConfig.licenseNumbers = licenseNumbers;
  }
  // if (inIFrame) {
  //   document.getElementById('editordiv').style.display = 'flex';
  // }
  launcher.launch(chartConfig);
}

function createChart() {
  launchEditor(false);
}

function editChart() {
  launchEditor(true);
}
