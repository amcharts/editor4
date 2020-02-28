import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/stacked100-column-chart.png';

const stacked100ColumnTemplate: ITemplate = {
  id: 'stacked100-column-chart',
  displayName: '100% stacked column chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({ numberOfValueFields: 3 }),

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
        type: 'ColumnSeries',

        name: 'Series 1',

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
        sequencedInterpolationDelay: 100,

        columns: {
          // Enable tooltips
          tooltipText: 'Series: {name}\n{categoryX}: {valueY}',
          // Disable outline
          strokeOpacity: 0
        },

        stacked: true
      },
      {
        // Set type
        type: 'ColumnSeries',

        name: 'Series 2',

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
        sequencedInterpolationDelay: 100,

        columns: {
          // Enable tooltips
          tooltipText: 'Series: {name}\n{categoryX}: {valueY}',
          // Disable outline
          strokeOpacity: 0
        },

        stacked: true
      },
      {
        // Set type
        type: 'ColumnSeries',

        name: 'Series 3',

        // Define data fields
        dataFields: {
          categoryX: 'category',
          valueY: 'value3',
          valueYShow: 'totalPercent'
        },

        // Modify default state
        defaultState: {
          transitionDuration: 1000
        },

        // Set animation options
        sequencedInterpolation: true,
        sequencedInterpolationDelay: 100,

        columns: {
          // Enable tooltips
          tooltipText: 'Series: {name}\n{categoryX}: {valueY}',
          // Disable outline
          strokeOpacity: 0
        },

        stacked: true
      }
    ]
  }
};

export default stacked100ColumnTemplate;
