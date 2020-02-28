import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/donut-3d-chart.png';

const donut3dTemplate: ITemplate = {
  id: 'donut-3d-chart',
  displayName: '3D donut chart',
  previewSrc: thumbnail,
  config: {
    type: 'PieChart3D',

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
        type: 'PieSeries3D',

        // Define data fields
        dataFields: {
          category: 'category',
          value: 'value'
        }
      }
    ]
  }
};

export default donut3dTemplate;
