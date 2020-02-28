import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/simple-area-chart.png';

const simpleAreaTemplate: ITemplate = {
  id: 'simple-area-chart',
  displayName: 'Simple area chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfDataItems: 30,
      valueRanges: [[300, 500]]
    }),

    // Add X axis
    xAxes: [
      {
        type: 'CategoryAxis',
        renderer: {
          minGridDistance: 60,
          grid: {
            location: 0.5
          }
        },
        dataFields: {
          category: 'category'
        },
        startLocation: 0.5,
        endLocation: 0.5
      }
    ],

    // Add Y axis
    yAxes: [
      {
        type: 'ValueAxis',
        renderer: {
          maxLabelPosition: 0.98
        },
        min: 0
      }
    ],

    // Add series
    series: [
      {
        // Set type
        type: 'LineSeries',

        fillOpacity: 0.5,
        strokeWidth: 2,

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

export default simpleAreaTemplate;
