import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/column-area-chart.png';

const columnAreaTemplate: ITemplate = {
  id: 'column-area-chart',
  displayName: 'Column/area chart',
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
            location: 0
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
        id: 'axis1',
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

        name: 'Series 1',

        // Define data fields
        dataFields: {
          categoryX: 'category',
          valueY: 'value1'
        },

        bullets: [
          {
            type: 'CircleBullet',
            tooltipText: '{name}\n{categoryX}: {valueY}'
          }
        ],

        strokeWidth: 2,
        fillOpacity: 0.5,

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
          tooltipText: '{categoryX}\n{valueY}',
          // Disable outline
          strokeOpacity: 0,
          tooltipPosition: 'pointer'
        }
      }
    ],

    // Add legend
    legend: {
      type: 'Legend'
    }
  }
};

export default columnAreaTemplate;
