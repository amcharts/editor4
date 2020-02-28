import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/color-highlight-bar-chart.png';

const chartData = SampleDataGenerator.getCategoryChartData();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(chartData[1] as any).color = '#f00';

const colorHighlightBarTemplate: ITemplate = {
  id: 'color-highlight-bar-chart',
  displayName: 'Color highlight bar chart',
  previewSrc: thumbnail,
  config: {
    type: 'XYChart',

    // Setting data
    data: chartData,

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
            strokeOpacity: 0,
            propertyFields: {
              fill: 'color'
            }
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

export default colorHighlightBarTemplate;
