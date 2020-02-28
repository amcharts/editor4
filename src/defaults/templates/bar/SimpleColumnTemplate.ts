import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/simple-column-chart.png';

const simpleColumnTemplate: ITemplate = {
  id: 'simple-column-chart',
  displayName: 'Simple column chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData(),

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
        // ensure columns start at 0
        min: 0,
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
            tooltipText: '{categoryX}\n{valueY}',
            tooltipPosition: 'pointer',
            // Disable outline
            strokeOpacity: 0
          }
        },

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

export default simpleColumnTemplate;
