import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/two-value-axes-column-chart.png';

const twoValueAxesColumnTemplate: ITemplate = {
  id: 'two-value-axes-column-chart',
  displayName: 'Column chart with two value axes',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfValueFields: 2,
      valueRanges: [[10, 100], [1000, 10000]]
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
        id: 'axis1',
        renderer: {
          maxLabelPosition: 0.98
        },
        min: 0,
        title: {
          text: 'Series 1'
        }
      },
      {
        type: 'ValueAxis',
        id: 'axis2',
        renderer: {
          // put it on the other side of the chart
          opposite: true,
          maxLabelPosition: 0.98
        },
        min: 0,
        title: {
          text: 'Series 2'
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
          tooltipText: '{categoryX}\n{valueY}',
          // Disable outline
          strokeOpacity: 0
        }
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

        yAxis: 'axis2',

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
          strokeOpacity: 0
        }
      }
    ],

    // Add legend
    legend: {
      type: 'Legend'
    }
  }
};

export default twoValueAxesColumnTemplate;
