import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/nested-donut-chart.png';

const nestedDonutTemplate: ITemplate = {
  id: 'nested-donut-chart',
  displayName: 'Nested donut chart',
  previewSrc: thumbnail,
  config: {
    type: 'PieChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfValueFields: 2
    }),

    radius: '60%',
    innerRadius: '30%',

    series: [
      {
        type: 'PieSeries',
        dataFields: {
          value: 'value1',
          category: 'category'
        },
        slices: {
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
          states: {
            hover: {
              properties: {
                shiftRadius: 0,
                scale: 0.9
              }
            }
          }
        },
        labels: {
          disabled: true
        },
        ticks: {
          disabled: true
        }
      },
      {
        type: 'PieSeries',
        dataFields: {
          value: 'value2',
          category: 'category'
        },
        slices: {
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
          states: {
            hover: {
              properties: {
                shiftRadius: 0,
                scale: 1.1
              }
            }
          }
        }
      }
    ]
  }
};

export default nestedDonutTemplate;
