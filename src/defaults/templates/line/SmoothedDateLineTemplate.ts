import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/smoothed-date-line-chart.png';

const smoothedDateLineTemplate: ITemplate = {
  id: 'smoothed-date-line-chart',
  displayName: 'Smoothed date-based line chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getDateXYChartData({
      numberOfValueFields: 2,
      valueRanges: [[50, 100], [80, 120]]
    }),

    // Add X axis
    xAxes: [
      {
        type: 'DateAxis',
        renderer: {
          minGridDistance: 20,
          grid: {
            location: 0
          }
        },
        dataFields: {
          date: 'date'
        }
      }
    ],

    // Add Y axis
    yAxes: [
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
        type: 'LineSeries',

        name: 'Series 1',

        bullets: [
          {
            type: 'CircleBullet',
            tooltipText: '{name}\n{dateX}: {valueY}'
          }
        ],

        // Define data fields
        dataFields: {
          dateX: 'date',
          valueY: 'value1'
        },

        // Modify default state
        defaultState: {
          transitionDuration: 1000
        },

        tensionX: 0.8,
        tensionY: 0.9,
        strokeWidth: 3,

        // Set animation options
        sequencedInterpolation: true,
        sequencedInterpolationDelay: 100
      },
      {
        // Set type
        type: 'LineSeries',
        name: 'Series 2',
        bullets: {
          values: [
            {
              type: 'Bullet',
              tooltipText: '{name}\n{dateX}: {valueY}',
              children: [
                {
                  type: 'Rectangle',
                  width: '10',
                  height: '10',
                  horizontalCenter: 'middle',
                  verticalCenter: 'middle'
                }
              ]
            }
          ]
        },

        // Define data fields
        dataFields: {
          dateX: 'date',
          valueY: 'value2'
        },

        // Modify default state
        defaultState: {
          transitionDuration: 1000
        },

        tensionX: 0.5,
        strokeWidth: 3,

        // Set animation options
        sequencedInterpolation: true,
        sequencedInterpolationDelay: 100
      }
    ]
  }
};

export default smoothedDateLineTemplate;
