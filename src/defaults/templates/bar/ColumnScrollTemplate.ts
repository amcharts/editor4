import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/column-scroll-chart.png';

const columnScrollTemplate: ITemplate = {
  id: 'column-scroll-chart',
  displayName: 'Column chart with scroll/zoom',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({ numberOfDataItems: 16 }),

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
            // Disable outline
            strokeOpacity: 0
          },
          // Enable tooltips
          tooltipText: '{categoryX}\n{valueY}'
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
    ],

    scrollbarX: {
      type: 'Scrollbar',
      start: 0.25,
      end: 0.75
    },

    // Add cursor
    cursor: {
      type: 'XYCursor',
      behavior: 'zoomX'
    }
  }
};

export default columnScrollTemplate;
