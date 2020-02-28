import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/bar-3d-chart.png';

const bar3dTemplate: ITemplate = {
  id: 'bar-3d-chart',
  displayName: '3D bar chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart3D',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfValueFields: 2,
      valueRanges: [[0, 50], [50, 100]]
    }),

    // Add Y axis
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

    // Add X axis
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
        type: 'ColumnSeries3D',

        name: 'Series 1',

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
        sequencedInterpolationDelay: 100,

        columns: {
          // Enable tooltips
          tooltipText: '{categoryY}\n{valueX}',
          // Disable outline
          strokeOpacity: 0
        },
        clustered: false
      },
      {
        // Set type
        type: 'ColumnSeries3D',

        name: 'Series 2',

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
        sequencedInterpolationDelay: 100,

        columns: {
          // Enable tooltips
          tooltipText: '{categoryY}\n{valueX}',
          // Disable outline
          strokeOpacity: 0
        },
        clustered: false
      }
    ]
  }
};

export default bar3dTemplate;
