import ITemplate from '../../../classes/ITemplate';
import SampleDataGenerator from '../../../utils/SampleDataGenerator';
import thumbnail from './thumbnails/pie-3d-chart.png';

const pie3dTemplate: ITemplate = {
  id: 'pie-3d-chart',
  displayName: '3D pie chart',
  previewSrc: thumbnail,
  config: {
    type: 'PieChart3D',

    // Setting data
    data: SampleDataGenerator.getCategoryChartData({
      numberOfDataItems: 3
    }),

    radius: '60%',

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

export default pie3dTemplate;
