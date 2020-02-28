import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/date-area-chart.png';

const dateAreaTemplate: ITemplate = {
  id: 'date-area-chart',
  displayName: 'Date-based area chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getDateXYChartData({
      numberOfValueFields: 2,
      valueRanges: [[250, 500], [200, 450]]
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
        }
      }
    ],

    // Add series
    series: [
      {
        // Set type
        type: 'LineSeries',

        name: 'Series 1',

        tooltipText: '{name}\n{dateX}: {valueY}',

        fillOpacity: 0.5,
        strokeWidth: 2,

        // Define data fields
        dataFields: {
          dateX: 'date',
          valueY: 'value1'
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

        tooltipText: '{name}\n{dateX}: {valueY}',

        fillOpacity: 0.5,
        strokeWidth: 2,

        // Define data fields
        dataFields: {
          dateX: 'date',
          valueY: 'value2'
        },

        // Modify default state
        defaultState: {
          transitionDuration: 1000
        },

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

export default dateAreaTemplate;
