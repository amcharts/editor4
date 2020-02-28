import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/date-area-scroll-chart.png';

const dateAreaScrollTemplate: ITemplate = {
  id: 'date-area-scroll-chart',
  displayName: 'Date-based area chart with scroll/zoom',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getDateXYChartData({
      fromDate: new Date(new Date().getFullYear() - 1, 1, 1),
      valueRanges: [[100, 200]]
    }),

    // Add X axis
    xAxes: [
      {
        type: 'DateAxis',
        renderer: {
          minGridDistance: 60,
          grid: {
            location: 0
          }
        },
        dataFields: {
          date: 'date'
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
        }
      }
    ],

    // Add series
    series: [
      {
        // Set type
        type: 'LineSeries',

        id: 's1',
        name: 'Series 1',

        tooltipText: '{name}\n{dateX}: {valueY}',

        fillOpacity: 0.5,

        // Define data fields
        dataFields: {
          dateX: 'date',
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
      type: 'XYChartScrollbar',
      series: ['s1'],
      start: 0.6,
      end: 0.75
    },

    cursor: {
      type: 'XYCursor',
      behavior: 'zoomX'
    }
  }
};

export default dateAreaScrollTemplate;
