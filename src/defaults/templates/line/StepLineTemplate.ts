import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/step-line-chart.png';

const stepLineTemplate: ITemplate = {
  id: 'step-line-chart',
  displayName: 'Step line chart',
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
          minGridDistance: 70,
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
        type: 'StepLineSeries',

        // Define data fields
        dataFields: {
          categoryX: 'category',
          valueY: 'value'
        },

        // Modify default state
        defaultState: {
          transitionDuration: 1000
        },

        strokeWidth: 2,

        tooltipText: '{categoryX}: {valueY}',

        // Set animation options
        sequencedInterpolation: true,
        sequencedInterpolationDelay: 100
      }
    ],

    cursor: {
      type: 'XYCursor'
    }
  }
};

export default stepLineTemplate;
