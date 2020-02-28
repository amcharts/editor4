import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/bar-scroll-chart.png';

const barScrollTemplate: ITemplate = {
  id: 'bar-scroll-chart',
  displayName: 'Bar chart with scroll/zoom',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({ numberOfDataItems: 16 }),

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

    xAxes: [
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
          tooltipText: '{categoryY}\n{valueX}'
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
    ],

    scrollbarY: {
      type: 'Scrollbar',
      start: 0.25,
      end: 0.75
    },

    // Add cursor
    cursor: {
      type: 'XYCursor',
      behavior: 'zoomY'
    }
  }
};

export default barScrollTemplate;
