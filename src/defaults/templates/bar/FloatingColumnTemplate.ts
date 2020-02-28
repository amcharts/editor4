import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/floating-column-chart.png';

const floatingColumnTemplate: ITemplate = {
  id: 'floating-column-chart',
  displayName: 'Floating columns chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfValueFields: 2,
      valueFieldNames: ['start', 'end'],
      valueRanges: [[0, 240], [260, 400]]
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
            tooltipText: '{categoryX}\n{openValueY} - {valueY}',
            tooltipPosition: 'pointer',
            // Disable outline
            strokeOpacity: 0
          }
        },

        // Define data fields
        dataFields: {
          categoryX: 'category',
          valueY: 'end',
          openValueY: 'start'
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

export default floatingColumnTemplate;
