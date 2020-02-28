import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/simple-line-chart.png';

const simpleLineTemplate: ITemplate = {
  id: 'simple-line-chart',
  displayName: 'Simple line chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      valueRanges: [[300, 500]]
    }),

    // Add X axis
    xAxes: [
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

        bullets: [
          {
            type: 'CircleBullet',
            tooltipText: '{categoryX}\n{valueY}'
          }
        ],

        // Define data fields
        dataFields: {
          categoryX: 'category',
          valueY: 'value'
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

export default simpleLineTemplate;
