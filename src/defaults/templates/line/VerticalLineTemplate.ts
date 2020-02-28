import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/vertical-line-chart.png';

const verticalLineTemplate: ITemplate = {
  id: 'vertical-line-chart',
  displayName: 'Vertical line chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfValueFields: 2,
      valueRanges: [[200, 450], [250, 450]]
    }),

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
          category: 'category'
        }
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

    // Add series
    series: [
      {
        // Set type
        type: 'LineSeries',

        name: 'Series 1',

        bullets: [
          {
            type: 'CircleBullet',
            tooltipText: '{name}\n{categoryY}: {valueX}'
          }
        ],

        // Define data fields
        dataFields: {
          categoryY: 'category',
          valueX: 'value1'
        },

        // Modify default state
        defaultState: {
          transitionDuration: 1000
        },

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
              tooltipText: '{name}\n{categoryY}: {valueX}',
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
          categoryY: 'category',
          valueX: 'value2'
        },

        // Modify default state
        defaultState: {
          transitionDuration: 1000
        },

        // Set animation options
        sequencedInterpolation: true,
        sequencedInterpolationDelay: 100
      }
    ]
  }
};

export default verticalLineTemplate;
