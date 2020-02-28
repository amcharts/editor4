import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/simple-pie-chart.png';

const simplePieTemplate: ITemplate = {
  id: 'simple-pie-chart',
  displayName: 'Simple pie chart',
  previewSrc: thumbnail,
  config: {
    type: 'PieChart',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfDataItems: 3
    }),

    radius: '60%',

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

export default simplePieTemplate;
