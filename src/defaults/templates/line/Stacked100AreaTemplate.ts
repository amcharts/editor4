import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/stacked100-area-chart.png';

const stacked100AreaTemplate: ITemplate = {
  id: 'stacked100-area-chart',
  displayName: '100% stacked area chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfValueFields: 2
    }),

    // Add X axis
    xAxes: [
      {
        type: 'CategoryAxis',
        renderer: {
          minGridDistance: 20,
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
        calculateTotals: true,
        min: 0,
        max: 100,
        strictMinMax: true
      }
    ],

    // Add series
    series: [
      {
        // Set type
        type: 'LineSeries',

        name: 'Series 1',
        stacked: true,

        tooltipText: '{name}\n{categoryX}: {valueY}',

        fillOpacity: 0.5,
        strokeWidth: 2,

        // Define data fields
        dataFields: {
          categoryX: 'category',
          valueY: 'value1',
          valueYShow: 'totalPercent'
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
        stacked: true,

        tooltipText: '{name}\n{categoryX}: {valueY}',

        fillOpacity: 0.5,
        strokeWidth: 2,

        // Define data fields
        dataFields: {
          categoryX: 'category',
          valueY: 'value2',
          valueYShow: 'totalPercent'
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

export default stacked100AreaTemplate;
