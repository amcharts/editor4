import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/date-column-chart.png';

const dateColumnTemplate: ITemplate = {
  id: 'date-column-chart',
  displayName: 'Date-based column chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getDateXYChartData(),

    // Add X axis
    xAxes: [
      {
        type: 'DateAxis',
        renderer: {
          minGridDistance: 20,
          grid: {
            location: 0
          }
        },
        dataFields: {
          date: 'date'
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
            tooltipText: '{dateX}\n{valueY}',
            tooltipPosition: 'pointer',
            // Disable outline
            strokeOpacity: 0
          }
        },

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
    ]
  }
};

export default dateColumnTemplate;
