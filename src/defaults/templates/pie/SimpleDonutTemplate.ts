import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/simple-donut-chart.png';

const simpleDonutTemplate: ITemplate = {
  id: 'simple-donut-chart',
  displayName: 'Simple donut chart',
  previewSrc: thumbnail,
  config: {
    type: 'PieChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfDataItems: 3
    }),

    radius: '60%',
    innerRadius: '40%',

    // Add series
    series: [
      {
        // Set type
        type: 'PieSeries',

        // Define data fields
        dataFields: {
          category: 'category',
          value: 'value'
        }
      }
    ]
  }
};

export default simpleDonutTemplate;
