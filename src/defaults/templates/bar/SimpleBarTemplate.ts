import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/simple-bar-chart.png';

const simpleBarTemplate: ITemplate = {
  id: 'simple-bar-chart',
  displayName: 'Simple bar chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData(),

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
        type: 'ColumnSeries',

        columns: {
          template: {
            type: 'Column',
            // Enable tooltips
            tooltipText: '{categoryY}\n{valueX}',
            tooltipPosition: 'pointer',
            // Disable outline
            strokeOpacity: 0
          }
        },

        // Define data fields
        dataFields: {
          categoryY: 'category',
          valueX: 'value'
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

export default simpleBarTemplate;
