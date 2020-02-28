import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/donut-rounded-chart.png';

const donutRoundedTemplate: ITemplate = {
  id: 'donut-rounded-chart',
  displayName: 'Donut chart with rounded corners',
  previewSrc: thumbnail,
  config: {
    type: 'PieChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfDataItems: 6
    }),

    radius: '60%',
    innerRadius: '30%',

    // Create series
    series: [
      {
        type: 'PieSeries',
        dataFields: {
          value: 'value',
          category: 'category'
        },
        slices: {
          cornerRadius: 10,
          innerCornerRadius: 7
        },
        hiddenState: {
          properties: {
            // this creates initial animation
            opacity: 1,
            endAngle: -90,
            startAngle: -90
          }
        }
      }
    ],

    // Add legend
    legend: {}
  }
};

export default donutRoundedTemplate;
