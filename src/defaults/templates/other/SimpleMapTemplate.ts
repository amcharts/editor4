import ITemplate from '../../../classes/ITemplate';

const simpleMapTemplate: ITemplate = {
  id: 'simple-map-chart',
  displayName: 'Simple Map chart',
  config: {
    type: 'MapChart',
    // Set map to use
    // eslint-disable-next-line @typescript-eslint/camelcase
    geodata: 'worldLow', //am4geodata_worldLow,

    // Set map projection
    projection: 'Miller',

    // Create polygon series
    series: [
      {
        id: 's1',
        type: 'MapPolygonSeries',
        useGeodata: true,
        exclude: ['AQ'], // exclude Antarctica

        // Configure tooltip
        tooltip: {
          fill: '#000000'
        },

        // Configure appearance of polygons
        mapPolygons: {
          tooltipText: '{name}',
          togglable: true,

          // Configure states
          states: {
            hover: {
              properties: {
                fill: '#67b7dc'
              }
            },
            active: {
              properties: {
                fill: '#a367dc'
              }
            }
          }

          // Set click events
          // events: {
          //   hit: function(event) {
          //     // if we have some country selected, set default state to it
          //     if (this.currentActive) {
          //       this.currentActive.setState('default');
          //     }

          //     chart.zoomToMapObject(event.target);
          //     this.currentActive = event.target;
          //   }
          // }
        }
      }
    ]

    // // Create a small map control
    // smallMap: {
    //   series: ['s1']
    // },

    // // Add zoom control
    // zoomControl: {
    //   slider: {
    //     height: 100
    //   }
    // }
  }
};

export default simpleMapTemplate;
