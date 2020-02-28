import ITemplate from '../../../classes/ITemplate';
import thumbnail from './thumbnails/simple-gauge-chart.png';

const simpleGaugeChart: ITemplate = {
  id: 'simple-gauge-chart',
  displayName: 'Simple Gauge chart',
  previewSrc: thumbnail,
  config: {
    type: 'GaugeChart',
    // Set inner radius
    innerRadius: -15,

    // Add axis
    xAxes: [
      {
        // Set axis type and settings
        type: 'ValueAxis',
        min: 0,
        max: 100,
        strictMinMax: true,

        // Add axis ranges
        axisRanges: [
          {
            value: 0,
            endValue: 50,
            axisFill: {
              fillOpacity: 1,
              fill: '#67b7dc'
            }
          },
          {
            value: 50,
            endValue: 80,
            axisFill: {
              fillOpacity: 1,
              fill: '#6771dc'
            }
          },
          {
            value: 80,
            endValue: 100,
            axisFill: {
              fillOpacity: 1,
              fill: '#a367dc'
            }
          }
        ]
      }
    ],

    // Add hand
    hands: [
      {
        type: 'ClockHand',
        id: 'h1'
      }
    ]
  }
};

export default simpleGaugeChart;
