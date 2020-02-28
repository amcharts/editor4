import ITemplate from '../../../classes/ITemplate';
import thumbnail from './thumbnails/basic-radar-chart.png';

const basicRadarTemplate: ITemplate = {
  id: 'basic-radar-chart',
  displayName: 'Basic Radar chart',
  previewSrc: thumbnail,
  config: {
    type: 'RadarChart',
    data: [
      {
        country: 'Lithuania',
        litres: 501
      },
      {
        country: 'Czech Republic',
        litres: 301
      },
      {
        country: 'Ireland',
        litres: 266
      },
      {
        country: 'Germany',
        litres: 165
      },
      {
        country: 'Australia',
        litres: 139
      },
      {
        country: 'Austria',
        litres: 336
      },
      {
        country: 'UK',
        litres: 290
      },
      {
        country: 'Belgium',
        litres: 325
      },
      {
        country: 'The Netherlands',
        litres: 40
      }
    ],
    xAxes: [
      {
        type: 'CategoryAxis',
        dataFields: {
          category: 'country'
        }
      }
    ],
    yAxes: [
      {
        type: 'ValueAxis'
      }
    ],
    series: [
      {
        type: 'RadarSeries',
        name: 'Sales',
        dataFields: {
          valueY: 'litres',
          categoryX: 'country'
        }
      }
    ]
  }
};

export default basicRadarTemplate;
