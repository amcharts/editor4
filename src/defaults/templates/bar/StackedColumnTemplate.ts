import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/stacked-column-chart.png';

const stackedColumnTemplate: ITemplate = {
  id: 'stacked-column-chart',
  displayName: 'Stacked column chart',
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
        }
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
          valueY: 'value1'
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
          valueY: 'value2'
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
          valueY: 'value3'
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

export default stackedColumnTemplate;
