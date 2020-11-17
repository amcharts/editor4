/* eslint-disable @typescript-eslint/no-explicit-any */
import { toJS } from 'mobx';

import Property from './Property';
import defaults from './PropertyDefaults';

import * as am4core from '@amcharts/amcharts4/core';
import '@amcharts/amcharts4/charts';
import '@amcharts/amcharts4/maps';
// import am4geodataWorldLow from '@amcharts/amcharts4-geodata/worldLow';

import IValueType from './IValueType';
import PropertyGroupFactory from './PropertyGroupFactory';
import { IChartData } from '../components/core/IChartData';
import { IPresetData } from './IConfig';
/**
 * Static class to handle {Property} <-> config transformations
 *
 * @export
 * @class PropertyConfigManager
 */
export default class PropertyConfigManager {
  /**
   * Returns {Property} representation of a chart based on provided config object.
   *
   * @static
   * @param {object} config - config object (from JSON config)
   * @returns {(Property | undefined)}
   */
  public static async configToProperty(
    config: object,
    presetData?: IPresetData
  ): Promise<[Property | undefined, Array<IChartData> | undefined]> {
    return new Promise<[Property | undefined, Array<IChartData> | undefined]>(
      // @todo figure out how to get rid of async here (see eslint docs on why this is bad)
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        // create chart Property from config by instantiating a chart object
        const chartProperties = await PropertyConfigManager.chartToProperty(
          config
        );

        let data: Array<IChartData> | undefined = undefined;
        if (presetData !== undefined) {
          data = presetData.data;
        } else {
          const dataIndex = Object.keys(config).indexOf('data');
          if (dataIndex >= 0) {
            data = Object.values(config)[dataIndex];
          }
        }

        if (data !== undefined) {
          PropertyConfigManager.sanitizeData(data);
        }

        if (chartProperties !== undefined) {
          // populate/mark values from config in the Property tree
          PropertyConfigManager.populatePropertiesFromConfig(
            chartProperties,
            config,
            presetData
          );
        }

        resolve([chartProperties, data]);
      }
    );
  }

  /**
   * Removes objects and other data types Editor can't handle.
   *
   * @static
   * @param {Array<IChartData>} data
   */
  public static sanitizeData(data: Array<IChartData>) {
    if (data !== undefined && data.length > 0) {
      data.forEach(dataItem => {
        Object.keys(dataItem).forEach((objProp, index) => {
          if (Array.isArray(dataItem[objProp])) {
            PropertyConfigManager.sanitizeData(dataItem[objProp]);
          } else if (dataItem[objProp] instanceof Date) {
            dataItem[objProp] = (dataItem[objProp] as Date).toISOString();
          } else if (typeof dataItem[objProp] === 'object') {
            delete dataItem[objProp];
          }
        });
      });
    }
  }

  /**
   * Transform Property into JSON config.
   *
   * @static
   * @param {Property} property
   * @returns {object}
   */
  public static propertyToConfig(
    property: Property,
    data?: Array<IChartData>,
    omitType?: boolean
  ): object {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    if (
      omitType !== true &&
      // @todo probably should make skipping interface types a little more subtle/specific?
      property.name.match(/^I[A-Z]/g) === null
    ) {
      result.type = property.name;
    }

    // special case for number formatters to ensure a new one is always created
    if (result.type === 'NumberFormatter') {
      result.forceCreate = true;
    }

    if (data !== undefined) {
      result.data = JSON.parse(JSON.stringify(data));
    }

    const propertyGroups = PropertyGroupFactory.getDefaultPropertyGroupNames();

    if (property.properties) {
      property.properties
        .slice() // to perform sort on a copy
        .sort((a, b) => {
          const groupIndexA = propertyGroups.findIndex(g => g === a.groupName);
          const groupIndexB = propertyGroups.findIndex(g => g === b.groupName);

          return groupIndexA > groupIndexB
            ? 1
            : groupIndexA < groupIndexB
            ? -1
            : a.orderNo > b.orderNo
            ? 1
            : -1;
        })
        .forEach(p => {
          if (p.isSet || p.isUserSet) {
            if (p.value !== undefined) {
              if (p.name === 'states') {
                // special case for states
                if (p.isSet || p.isUserSet) {
                  result[p.name] = {};
                  (p.value as Property[]).forEach(stateProp => {
                    if (
                      stateProp.properties &&
                      (stateProp.isSet || stateProp.isUserSet)
                    ) {
                      const stateNameProp = stateProp.properties.find(
                        spp => spp.name === 'name'
                      );
                      const statePropertiesProp = stateProp.properties.find(
                        spp => spp.name === 'properties'
                      );
                      if (
                        stateNameProp !== undefined &&
                        statePropertiesProp !== undefined &&
                        statePropertiesProp.value !== undefined
                      ) {
                        result[p.name][stateNameProp.value] = {};
                        result[p.name][
                          stateNameProp.value
                        ].properties = PropertyConfigManager.propertyToConfig(
                          statePropertiesProp.value,
                          undefined,
                          statePropertiesProp.omitValueType
                        );
                      }
                    }
                  });
                }
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'list'
              ) {
                if (
                  p.name !== 'series' && // @todo remove special case filter - doesn't work when series are set in .values
                  p.valueTypes &&
                  p.valueTypes[0].name === 'ListTemplate'
                ) {
                  // special case for ListTemplate-type properties
                  result[p.name] = {};
                  if (
                    (p.value as Property[]).length > 0 &&
                    (p.value as Property[]).findIndex(
                      item => item.isSet === true || item.isUserSet === true
                    ) >= 0
                  ) {
                    result[p.name].values = (p.value as Property[]).map(subp =>
                      PropertyConfigManager.propertyToConfig(
                        subp,
                        undefined,
                        p.omitValueType
                      )
                    );
                  }
                } else if (
                  p.valueTypes &&
                  p.valueTypes[0].name === 'DictionaryTemplate'
                ) {
                  // special case for List-type properties
                  result[p.name] = {};
                  (p.value as Property[]).forEach(subp => {
                    const pName = subp.getStringPropertyValue('name');
                    if (pName !== undefined) {
                      result[p.name][
                        pName.toString()
                      ] = PropertyConfigManager.propertyToConfig(
                        subp,
                        undefined,
                        p.omitValueType
                      );
                    }
                  });
                } else {
                  // special case for List-type properties
                  result[p.name] = (p.value as Property[]).map(subp =>
                    PropertyConfigManager.propertyToConfig(
                      subp,
                      undefined,
                      p.omitValueType
                    )
                  );
                }
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'scalar'
              ) {
                if (
                  p.valueTypes &&
                  p.valueTypes.length > 0 &&
                  p.valueTypes[0].name !== 'string' &&
                  p.value.toString() === Number(p.value).toString()
                ) {
                  // make sure numbers are rendered without quotes
                  result[p.name] = Number(p.value);
                } else if (typeof p.value === 'object' && p.value !== null) {
                  // special case when "any" value is an object
                  result[p.name] = toJS(p.value);
                } else {
                  result[p.name] = p.value;
                }
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'object'
              ) {
                result[p.name] = PropertyConfigManager.propertyToConfig(
                  p.value,
                  undefined,
                  p.omitValueType
                );
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'elementref'
              ) {
                if (p.editorType === 'ChartElementReference') {
                  result[p.name] = p.value;
                } else {
                  result[p.name] = (p.value as string[]).map(id => id);
                }
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'array'
              ) {
                result[p.name] = [];
                p.value.forEach((val: string | undefined) => {
                  if (
                    val !== undefined &&
                    !isNaN(parseFloat(val)) &&
                    parseFloat(val).toString() === val.toString()
                  ) {
                    // number - add converted
                    result[p.name].push(parseFloat(val));
                  } else {
                    // push as is
                    result[p.name].push(val);
                  }
                });
              }
            }
            if (p.properties && p.properties.length > 0) {
              // go one level deeper
              if (
                result[p.name] !== undefined &&
                p.valueTypes &&
                p.valueTypes[0].name.indexOf('Template') >= 0
              ) {
                // special case for ListTemplate properties
                const templateProperty = p.properties.find(
                  tp => tp.name === 'template'
                );
                if (
                  templateProperty !== undefined &&
                  templateProperty.value !== undefined
                ) {
                  result[
                    p.name
                  ].template = PropertyConfigManager.propertyToConfig(
                    templateProperty.value,
                    undefined,
                    p.omitValueType
                  );
                }
              } else {
                result[p.name] = PropertyConfigManager.propertyToConfig(
                  p,
                  undefined,
                  p.omitValueType
                );
              }
            }
          }
        });
    }

    return result;
  }

  public static propertyToJs(
    property: Property,
    data?: Array<IChartData>,
    varName?: string,
    baseModule?: string
  ): string {
    let result = '';

    const localVarName = varName !== undefined ? varName : 'chart';
    const localVarNamePrefix = localVarName
      .split('.')
      .map((np, npi) => {
        if (npi > 0) {
          return np[0].toUpperCase() + np.substr(1);
        } else {
          return np;
        }
      })
      .join('');
    const localBaseModule =
      baseModule !== undefined
        ? baseModule
        : property.modules !== undefined && property.modules.length > 0
        ? property.modules[0]
        : 'charts';
    const localModule =
      property.modules === undefined
        ? '_NOT_FOUND' // should never happen in reality
        : property.modules.length === 1
        ? property.modules[0]
        : property.modules.indexOf(localBaseModule) > -1
        ? localBaseModule
        : property.modules.indexOf('core') > -1
        ? 'core'
        : 'charts';

    if (localVarName === 'chart') {
      // top level
      result = `let chart = am4core.create("chartdiv", am4${localBaseModule}.${property.name});\n`;
    }

    if (data !== undefined) {
      result += `\n${localVarName}.data = ${JSON.stringify(data)};\n`;
    }

    const propertyGroups = PropertyGroupFactory.getDefaultPropertyGroupNames();

    if (property.properties) {
      let prevGroup = '';
      property.properties
        .slice() // to perform sort on a copy
        .sort((a, b) => {
          const groupIndexA = propertyGroups.findIndex(g => g === a.groupName);
          const groupIndexB = propertyGroups.findIndex(g => g === b.groupName);

          return groupIndexA > groupIndexB
            ? 1
            : groupIndexA < groupIndexB
            ? -1
            : a.orderNo > b.orderNo
            ? 1
            : -1;
        })
        .forEach(p => {
          if (p.isSet || p.isUserSet) {
            if (prevGroup !== p.groupName) {
              if (prevGroup !== '') {
                result += `\n`;
              }
              prevGroup = p.groupName;
            }

            if (p.value !== undefined) {
              const pModule =
                p.value.modules === undefined
                  ? localModule
                  : p.value.modules.length === 1
                  ? p.value.modules[0]
                  : p.value.modules.indexOf(localBaseModule) > -1
                  ? localBaseModule
                  : p.value.modules[0];

              if (p.name === 'states') {
                // special case for states
                if (p.isSet || p.isUserSet) {
                  (p.value as Property[]).forEach(stateProp => {
                    if (
                      stateProp.properties &&
                      (stateProp.isSet || stateProp.isUserSet)
                    ) {
                      const stateNameProp = stateProp.properties.find(
                        spp => spp.name === 'name'
                      );
                      const statePropertiesProp = stateProp.properties.find(
                        spp => spp.name === 'properties'
                      );
                      if (
                        stateNameProp !== undefined &&
                        statePropertiesProp !== undefined &&
                        statePropertiesProp.value !== undefined
                      ) {
                        const stateVarName =
                          localVarName === 'chart'
                            ? `${stateNameProp.value}State`
                            : `${localVarNamePrefix}${(stateNameProp.value as string)[0].toUpperCase() +
                                (stateNameProp.value as string).substr(
                                  1
                                )}State`;
                        result += `\nlet ${stateVarName} = ${localVarName}.${p.name}.create("${stateNameProp.value}");\n`;
                        result += PropertyConfigManager.propertyToJs(
                          statePropertiesProp.value,
                          undefined,
                          `${stateVarName}.properties`,
                          baseModule
                        );
                      }
                    }
                  });
                }
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'list'
              ) {
                if (
                  p.valueTypes &&
                  p.valueTypes[0].name !== 'DictionaryTemplate'
                ) {
                  // special case for ListTemplate-type properties
                  if (
                    (p.value as Property[]).length > 0 &&
                    (p.value as Property[]).findIndex(
                      item => item.isSet === true || item.isUserSet === true
                    ) >= 0
                  ) {
                    (p.value as Property[]).forEach((subp, subpIndex) => {
                      const idValue = subp.getStringPropertyValue('id');
                      const subpName = idValue
                        ? idValue
                        : localVarName === 'chart'
                        ? `${p.name}${subpIndex + 1}`
                        : `${localVarNamePrefix}${p.name[0].toUpperCase() +
                            p.name.substr(1)}${subpIndex + 1}`;
                      const subpModule =
                        subp.modules === undefined
                          ? localModule
                          : subp.modules.length === 1
                          ? subp.modules[0]
                          : subp.modules.indexOf(localBaseModule) > -1
                          ? localBaseModule
                          : subp.modules[0];
                      result += `\nlet ${subpName} = `;
                      if (subp.omitValueType) {
                        result += `${localVarName}.${p.name}.create();\n`;
                      } else {
                        result += `${localVarName}.${p.name}.push(new am4${subpModule}.${subp.name}());\n`;
                      }
                      result += PropertyConfigManager.propertyToJs(
                        subp,
                        undefined,
                        subpName,
                        baseModule
                      );
                    });
                  }
                } else if (
                  p.valueTypes &&
                  p.valueTypes[0].name === 'DictionaryTemplate'
                ) {
                  // special case for DictionaryTemplate-type properties
                  (p.value as Property[]).forEach(subp => {
                    const pName = subp.getStringPropertyValue('name');
                    if (pName !== undefined) {
                      result += `\nlet dt${pName} = ${localVarName}.${p.name}.create("${pName}");\n`;
                      result += PropertyConfigManager.propertyToJs(
                        subp,
                        undefined,
                        `dt${pName}`,
                        baseModule
                      );
                    }
                  });
                }
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'scalar'
              ) {
                result += `${localVarName}.${p.name} = `;
                if (
                  p.valueTypes &&
                  p.valueTypes.length === 1 &&
                  p.valueTypes[0].name !== 'string' &&
                  (p.value.toString() === Number(p.value).toString() ||
                    p.valueTypes[0].name === 'boolean')
                ) {
                  result += `${p.value};\n`;
                } else {
                  result += `"${p.value}";\n`;
                }
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'object'
              ) {
                if (
                  !p.omitValueType &&
                  (p.value.name as string).match(/^I[A-Z]/g) === null
                ) {
                  result += `${localVarName}.${p.name} = new am4${pModule}.${p.value.name}();\n`;
                }
                result += PropertyConfigManager.propertyToJs(
                  p.value,
                  undefined,
                  `${localVarName}.${p.name}`,
                  baseModule
                );
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'elementref'
              ) {
                if (p.editorType === 'ChartElementReference') {
                  result += `${localVarName}.${p.name} = ${p.value};\n`;
                } else {
                  (p.value as string[]).forEach(id => {
                    result += `${localVarName}.${p.name}.push(${p.value});\n`;
                  });
                }
              } else if (
                PropertyConfigManager.getPropertyTypeFamily(p) === 'array'
              ) {
                // result[p.name] = p.value;
              }
            }
            if (p.properties && p.properties.length > 0) {
              // go one level deeper
              if (
                // @todo: what is this criteria for?
                // result[p.name] !== undefined &&
                p.valueTypes &&
                p.valueTypes[0].name.indexOf('Template') >= 0
              ) {
                // special case for ListTemplate properties
                const templateProperty = p.properties.find(
                  tp => tp.name === 'template'
                );
                if (
                  templateProperty !== undefined &&
                  templateProperty.value !== undefined
                ) {
                  result += PropertyConfigManager.propertyToJs(
                    templateProperty.value,
                    undefined,
                    `${localVarName}.${p.name}.template`,
                    baseModule
                  );
                }
              } else {
                result += PropertyConfigManager.propertyToJs(
                  p,
                  undefined,
                  `${localVarName}.${p.name}`,
                  baseModule
                );
              }
            }
          }
        });
    }

    return result;
  }

  /**
   * Recreate automatic (amCharts set) values.
   *
   * Values can change as a side effect of some other value changes sometimes,
   * and need to be re-evaluated periodically.
   *
   * @static
   * @param {Property} currentProperties - current Property
   * @param {Property} newProperties - Property with newly generated values
   */
  public static resetAutoValues(
    currentProperties: Property,
    newProperties: Property
  ) {
    // ?? what's the right criteria?
    if (currentProperties.value !== undefined) {
      if (
        PropertyConfigManager.getPropertyTypeFamily(currentProperties) ===
        'list'
      ) {
        (currentProperties.value as Property[]).forEach((p, index) => {
          PropertyConfigManager.resetAutoValues(
            p,
            (newProperties.value as Property[])[index]
          );
        });
      } else if (
        PropertyConfigManager.getPropertyTypeFamily(currentProperties) ===
        'scalar'
      ) {
        // known value types
        if (currentProperties.autoValue !== newProperties.autoValue) {
          currentProperties.autoValue = newProperties.autoValue;
        }
        if (!currentProperties.isUserSet && !currentProperties.isSet) {
          currentProperties.value = newProperties.autoValue;
        }
      } else {
        // log unknown value types

        // eslint-disable-next-line no-console
        console.log(
          `Unsupported value type: ${PropertyConfigManager.valueTypesToString(
            currentProperties.valueTypes
          )} (${currentProperties.name})`
        );
      }
    }

    if (currentProperties.properties && newProperties.properties) {
      // go one level deeper
      currentProperties.properties.forEach(p => {
        const np = newProperties.properties
          ? newProperties.properties.find(n => n.name === p.name)
          : undefined;
        if (np !== undefined) {
          PropertyConfigManager.resetAutoValues(p, np);
        }
      });
    }
  }

  public static getChartElementsForReference(
    chartProperty: Property,
    targetProperty: Property
  ): Property[] {
    if (chartProperty.properties !== undefined) {
      let lookupPropertyName: RegExp;
      switch (targetProperty.name) {
        case 'series': {
          lookupPropertyName = /^series$/g;
          break;
        }
        case 'xAxis': {
          lookupPropertyName = /^xAxes$/g;
          break;
        }
        case 'yAxis': {
          lookupPropertyName = /^yAxes$/g;
          break;
        }
        case 'baseAxis': {
          lookupPropertyName = /^xAxes|yAxes$/g;
          break;
        }
        default: {
          return [];
        }
      }

      if (lookupPropertyName !== undefined) {
        const list = chartProperty.properties.filter(
          p => p.name.match(lookupPropertyName) !== null
        );
        if (list !== undefined) {
          let result: Property[] = [];
          list.forEach(l => (result = result.concat(l.value)));
          return result;
        }
      }
    }

    return [];
  }

  /**
   * Populate properties from an actual rendered chart.
   *
   * @private
   * @static
   * @param {object} config
   * @returns {(Property | undefined)}
   */
  private static async chartToProperty(
    config: object
  ): Promise<Property | undefined> {
    // @todo figure out how to get rid of async here (see eslint docs on why this is bad)
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<Property | undefined>(async (resolve, reject) => {
      const configCopy = JSON.parse(JSON.stringify(config)); // seems to be destructing the config otherwise

      const renderConfigCopy = await PropertyConfigManager.resolveGeoData(
        configCopy
      );

      const helperDiv = document.createElement('div');
      document.body.appendChild(helperDiv);

      const helperChart = am4core.createFromConfig(renderConfigCopy, helperDiv);
      if (helperChart.className !== (renderConfigCopy as any).type) {
        console.log('ERROR creating chart.');
        console.log(
          `IMPORTANT: do not pass your raw chart configuration object to amCharts and the Editor.
Always create a copy of your config object before passing it to the charts.
Always include chart type in your JSON config you pass to the Editor.`
        );
      }
      helperChart.events.on('ready', () => {
        const result = PropertyConfigManager.chartPartToProperty(
          helperChart,
          config
        );

        // clean-up helper chart
        helperChart.dispose();
        document.body.removeChild(helperDiv);

        resolve(result);
      });
    });
  }

  public static async resolveGeoData(config: any): Promise<object> {
    // @todo figure out how to get rid of async here (see eslint docs on why this is bad)
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<object>(async resolve => {
      if (config.type === 'MapChart' && typeof config.geodata === 'string') {
        // handle geodata
        // @todo implement proper loading based on actual value set
        const configCopy = JSON.parse(JSON.stringify(config));
        const geodata = await import(
          '@amcharts/amcharts4-geodata/worldLow' // + configCopy.geodata
        );
        configCopy.geodata = geodata.default;

        resolve(configCopy);
      } else {
        resolve(config);
      }
    });
  }

  /**
   * Populate properties from an actual rendered chart part.
   *
   * @private
   * @static
   * @param {am4core.Sprite} chartPart
   * @param {string} [defaultClassName]
   * @returns {(Property | undefined)}
   */
  private static chartPartToProperty(
    chartPart: am4core.Sprite,
    subConfig: object,
    defaultClassName?: string
  ): Property | undefined {
    let property: Property | undefined;

    const className = chartPart.className
      ? chartPart.className
      : defaultClassName !== undefined
      ? defaultClassName
      : '';
    const propDefaults = defaults.getDefaults(className);

    if (propDefaults !== undefined && subConfig !== null) {
      property = new Property(propDefaults);

      if (property && property.properties) {
        property.properties.forEach(p => {
          const chartPropValue: any = (chartPart as any)[p.name];
          // values in config (if present)
          const propIndex =
            subConfig !== undefined
              ? Object.keys(subConfig).indexOf(p.name)
              : -1;
          const configPropValue =
            propIndex > -1 ? Object.values(subConfig)[propIndex] : undefined;

          if (p.name === 'states') {
            // special case for states
            if (
              chartPropValue &&
              chartPropValue._dictionary &&
              Object.keys(chartPropValue._dictionary).length > 0
            ) {
              if (p.value === undefined) {
                p.value = new Array<Property>();
              }

              Object.keys(chartPropValue._dictionary).forEach(st => {
                const stateConfig =
                  subConfig !== undefined &&
                  (subConfig as any).states !== undefined &&
                  (subConfig as any).states[st] !== undefined
                    ? (subConfig as any).states[st].properties
                    : undefined;

                if (stateConfig !== undefined) {
                  const subProp = PropertyConfigManager.chartPartToProperty(
                    chartPropValue._dictionary[st],
                    stateConfig
                  );
                  if (
                    subProp !== undefined &&
                    subProp.properties !== undefined
                  ) {
                    const propertiesProperty = subProp.properties.find(
                      pp => pp.name === 'properties'
                    );
                    if (propertiesProperty !== undefined) {
                      propertiesProperty.editorType = 'object';
                      if (
                        p.valueTypes &&
                        p.valueTypes.length > 0 &&
                        p.valueTypes[0].subTypes &&
                        p.valueTypes[0].subTypes.length > 1 &&
                        p.valueTypes[0].subTypes[1].subTypes &&
                        p.valueTypes[0].subTypes[1].subTypes.length > 0
                      ) {
                        propertiesProperty.valueTypes = [
                          p.valueTypes[0].subTypes[1].subTypes[0]
                        ];
                        propertiesProperty.value = PropertyConfigManager.chartPartToProperty(
                          chartPropValue._dictionary[st].properties,
                          stateConfig,
                          propertiesProperty.valueTypes[0].name
                        );
                      }
                    }
                  }
                  p.value.push(subProp);
                }
              });
            }
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'list'
          ) {
            // special case for List-type properties
            if (p.value === undefined) {
              p.value = new Array<Property>();
            }

            if (chartPropValue !== undefined) {
              // add items
              if (
                p.valueTypes &&
                p.valueTypes[0].name !== 'DictionaryTemplate'
              ) {
                // don't iterate values if property not in the config or editorType is Template (values don't matter)
                if (propIndex > -1 && p.editorType !== 'Template') {
                  const valuesObject = (chartPropValue as any)['values'];
                  valuesObject.forEach(
                    (subPart: am4core.Sprite, index: number) => {
                      const subProp = PropertyConfigManager.chartPartToProperty(
                        subPart,
                        configPropValue && configPropValue[index]
                          ? configPropValue[index]
                          : configPropValue && configPropValue['values']
                          ? configPropValue['values'][index]
                          : {}
                      );
                      if (subProp !== undefined) {
                        p.value.push(subProp);
                      }
                    }
                  );
                }
              } else {
                // don't go any deeper if property not in the config
                if (propIndex > -1) {
                  const vo = (chartPropValue as any)['_dictionary'];
                  const dictionaryKeys = Object.keys(vo);
                  dictionaryKeys.forEach(dKey => {
                    const subPart = (vo as any)[dKey];
                    const subProp = PropertyConfigManager.chartPartToProperty(
                      subPart,
                      configPropValue[dKey]
                    );
                    if (subProp !== undefined) {
                      const subPropNameProp = subProp.properties
                        ? subProp.properties.find(sp => sp.name === 'name')
                        : undefined;
                      if (subPropNameProp !== undefined) {
                        subPropNameProp.value = dKey;
                      }
                      p.value.push(subProp);
                    }
                  });
                }
              }

              if (
                p.valueTypes &&
                p.valueTypes[0].name.indexOf('Template') >= 0
              ) {
                p.properties = new Array<Property>();
                const templateProperty = new Property({
                  name: 'template',
                  editorType: 'object',
                  valueTypes: p.valueTypes
                    ? p.valueTypes[0].subTypes
                    : undefined
                });
                p.properties.push(templateProperty);

                // don't go any deeper if property not in the config
                if (propIndex > -1) {
                  const templatePropertyValue = PropertyConfigManager.chartPartToProperty(
                    (chartPropValue as any)['template'],
                    configPropValue['template'] !== undefined
                      ? configPropValue['template']
                      : configPropValue
                  );
                  templateProperty.value = templatePropertyValue;
                }
              }
            }
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'scalar'
          ) {
            // known scalar value types
            if (
              // vtString === 'string' &&
              chartPropValue === undefined
            ) {
              // undefined is not handled correctly by textboxes
              p.value = '';
              p.autoValue = '';
            } else {
              p.value = chartPropValue;
              p.autoValue = chartPropValue;
            }
          } else if (
            chartPropValue !== undefined &&
            PropertyConfigManager.getPropertyTypeFamily(p) === 'object'
          ) {
            // reference type
            // don't go any deeper if property not in the config
            if (propIndex > -1) {
              p.value = PropertyConfigManager.chartPartToProperty(
                chartPropValue,
                configPropValue,
                p.valueTypes ? p.valueTypes[0].name : ''
              );
            }
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'array'
          ) {
            // simple array
            p.value = chartPropValue;
            p.autoValue = chartPropValue;
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'elementref'
          ) {
            if (chartPropValue !== undefined) {
              if (p.editorType === 'ChartElementReference') {
                p.value =
                  chartPropValue['id'] !== undefined
                    ? chartPropValue['id']
                    : chartPropValue['uid'];
                p.autoValue = p.value;
              } else {
                p.value = [];
                (chartPropValue.values as []).forEach(el => {
                  p.value.push(el['id'] !== undefined ? el['id'] : el['uid']);
                });
                p.autoValue = p.value;
              }
            }
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) !== 'skip' &&
            chartPropValue !== undefined
          ) {
            // eslint-disable-next-line no-console
            console.log(
              `Unsupported value type: ${PropertyConfigManager.valueTypesToString(
                p.valueTypes
              )} (${p.name}: ${chartPropValue})`
            );
          }
        });
      }
    }

    return property;
  }

  /**
   * Update properties based on values from JSON config
   *
   * @private
   * @static
   * @param {Property} subProperty Property level
   * @param {object} subConfig config level
   */
  private static populatePropertiesFromConfig(
    subProperty: Property,
    subConfig: object,
    presetData?: IPresetData
  ) {
    if (subProperty && subProperty.properties) {
      subProperty.properties.forEach(p => {
        const propIndex = Object.keys(subConfig).indexOf(p.name);
        if (propIndex >= 0) {
          const propValue = Object.values(subConfig)[propIndex];

          if (p.name === 'states') {
            // special case for states
            if (p.value && propValue) {
              (p.value as Property[]).forEach(stateProp => {
                if (stateProp.properties) {
                  const stateNameProp = stateProp.properties.find(
                    spp => spp.name === 'name'
                  );
                  const statePropertiesProp = stateProp.properties.find(
                    spp => spp.name === 'properties'
                  );
                  if (
                    stateNameProp !== undefined &&
                    statePropertiesProp !== undefined
                  ) {
                    const stateValueIndex = Object.keys(propValue).indexOf(
                      stateNameProp.value
                    );
                    if (stateValueIndex >= 0) {
                      p.isSet = true;
                      stateProp.isSet = true;
                      stateNameProp.isSet = true;
                      statePropertiesProp.isSet = true;
                      const statePropertyValues = (Object.values(propValue)[
                        stateValueIndex
                      ] as any).properties as object;
                      PropertyConfigManager.populatePropertiesFromConfig(
                        statePropertiesProp.value,
                        statePropertyValues,
                        presetData
                      );
                    }
                  }
                }
              });
            }
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'list'
          ) {
            if (p.valueTypes && p.valueTypes[0].name === 'DictionaryTemplate') {
              const dtKeys = Object.keys(propValue);
              const dtValues = Object.values(propValue);
              dtKeys.forEach((key, kIndex) => {
                if (key !== 'template') {
                  p.isSet = true;
                  PropertyConfigManager.populatePropertiesFromConfig(
                    p.value[key],
                    dtValues[kIndex] as object,
                    presetData
                  );
                  p.value[key].isSet = true;
                }
              });

              if (propValue['template'] !== undefined) {
                const templatePart =
                  propValue['template'] !== undefined
                    ? propValue['template']
                    : propValue;
                const templateProperty = p.properties
                  ? p.properties.find(tp => tp.name === 'template')
                  : undefined;
                if (templateProperty !== undefined) {
                  p.isSet = true;
                  PropertyConfigManager.populatePropertiesFromConfig(
                    templateProperty.value,
                    templatePart,
                    presetData
                  );
                }
              }
            } else {
              // special case for List-type properties
              const valuesPart =
                propValue['values'] !== undefined &&
                propValue['values'] instanceof Array
                  ? propValue['values']
                  : propValue instanceof Array
                  ? propValue
                  : undefined;
              if (valuesPart !== undefined) {
                (valuesPart as object[]).forEach((subConfig, scIndex) => {
                  p.isSet = true;
                  p.value[scIndex].isSet = true;
                  PropertyConfigManager.populatePropertiesFromConfig(
                    p.value[scIndex],
                    subConfig,
                    presetData
                  );
                });
              }

              if (
                propValue['template'] !== undefined ||
                valuesPart === undefined
              ) {
                const templatePart =
                  propValue['template'] !== undefined
                    ? propValue['template']
                    : propValue;
                const templateProperty = p.properties
                  ? p.properties.find(tp => tp.name === 'template')
                  : undefined;
                if (templateProperty !== undefined) {
                  p.isSet = true;
                  PropertyConfigManager.populatePropertiesFromConfig(
                    templateProperty.value,
                    templatePart,
                    presetData
                  );
                }
              }
            }
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'scalar'
          ) {
            // known value type properties

            if (presetData !== undefined && p.editorType === 'DataField') {
              // resolve data field mapping
              p.value = presetData.templatePropertyMap.get(propValue);
              if (p.value === undefined) {
                p.value = propValue;
              }
            } else {
              p.value = propValue;
            }
            p.isSet = true;
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'object'
          ) {
            p.isSet = true;
            PropertyConfigManager.populatePropertiesFromConfig(
              p.value as Property,
              propValue,
              presetData
            );
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'elementref'
          ) {
            p.isSet = true;
          } else if (
            PropertyConfigManager.getPropertyTypeFamily(p) === 'array'
          ) {
            p.value = propValue;
            p.isSet = true;
          } else if (p.name === 'geodata' && typeof propValue === 'string') {
            // special case for geodata
            p.valueTypes = [{ kind: 'value', name: 'string' }];
            p.editorType = 'string';
            p.isSet = true;
            p.value = propValue;
          }
        }
      });
    }
  }

  /**
   * Helper method to generate string representation of value types.
   *
   * Used in criteria for type handling.
   *
   * @private
   * @static
   * @param {IValueType[]} [valueTypes]
   * @returns {string}
   */
  private static valueTypesToString(valueTypes?: IValueType[]): string {
    if (valueTypes !== undefined) {
      return valueTypes
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        .map(vt => vt.name)
        .join('--');
    }

    return '__undefined__';
  }

  /**
   * Returns true if all possible value types are of 'ref' kind
   *
   * @private
   * @static
   * @param {Property} p
   * @returns {boolean}
   */
  private static isRefType(p: Property): boolean {
    if (
      p &&
      p.valueTypes &&
      p.valueTypes.length > 0 &&
      p.valueTypes.find(vt => vt.kind !== 'ref') === undefined
    ) {
      return true;
    }
    return false;
  }

  /**
   * Return property type family (type group)
   *
   * @private
   * @static
   * @param {Property} p
   * @returns {('scalar' | 'list' | 'object' | 'unknown')}
   */
  private static getPropertyTypeFamily(
    p: Property
  ):
    | 'scalar'
    | 'list'
    | 'object'
    | 'array'
    | 'elementref'
    | 'skip'
    | 'unknown' {
    if (p.editorType.startsWith('ChartElementReference')) {
      return 'elementref';
    }

    const vtString = PropertyConfigManager.valueTypesToString(p.valueTypes);
    if (
      vtString.match(
        /^(List|ListTemplate|DictionaryTemplate|SortedListTemplate)$/g
      )
    ) {
      return 'list';
    } else if (
      vtString.match(
        /^(string|number|boolean|number--Percent|number--string|number--undefined|NumberFormatOptions--string|any)$/g
      ) ||
      p.editorType.match(
        /^(select|string|number|boolean|Color|Color--LinearGradient--Pattern--RadialGradient)$/g
      )
    ) {
      return 'scalar';
    } else if (p.editorType === 'object' || p.editorType === 'PropertyFields') {
      return 'object';
    } else if (
      p.valueTypes &&
      p.valueTypes.length === 1 &&
      p.valueTypes[0].subTypes &&
      p.valueTypes[0].subTypes.length === 1 &&
      (p.valueTypes[0].subTypes[0].kind === 'value' ||
        p.valueTypes[0].subTypes[0].name === 'Color') // @todo change when color picker is implemented
    ) {
      // simple array
      return 'array';
    } else if (vtString === 'P' && p.name === 'properties') {
      // special case for states.properties
      return 'skip';
    }

    return 'unknown';
  }

  /**
   * Goes through the property tree and changes data field values in data.
   * To be used when column names in underlying data changes.
   *
   * @param {Property} property
   * @param {Array<string>} oldFields
   * @param {Array<string>} newFields
   */
  public static adjustDataFields(
    property: Property,
    oldFields: Array<string>,
    newFields: Array<string>
  ): void {
    if (property.properties) {
      property.properties.forEach(p => {
        if (p.isSet || p.isUserSet) {
          if (p.value !== undefined) {
            if (p.name === 'states') {
              // special case for states if needed?
            } else if (
              PropertyConfigManager.getPropertyTypeFamily(p) === 'list'
            ) {
              if (p.valueTypes && p.valueTypes[0].name === 'ListTemplate') {
                // special case for ListTemplate-type properties
                if (
                  (p.value as Property[]).length > 0 &&
                  (p.value as Property[]).findIndex(
                    item => item.isSet === true || item.isUserSet === true
                  ) >= 0
                ) {
                  (p.value as Property[]).forEach(subp =>
                    PropertyConfigManager.adjustDataFields(
                      subp,
                      oldFields,
                      newFields
                    )
                  );
                }
              } else if (
                p.valueTypes &&
                p.valueTypes[0].name === 'DictionaryTemplate'
              ) {
                // special case for List-type properties
                (p.value as Property[]).forEach(subp => {
                  const pName = subp.getStringPropertyValue('name');
                  if (pName !== undefined) {
                    PropertyConfigManager.adjustDataFields(
                      subp,
                      oldFields,
                      newFields
                    );
                  }
                });
              } else {
                // special case for List-type properties
                (p.value as Property[]).forEach(subp =>
                  PropertyConfigManager.adjustDataFields(
                    subp,
                    oldFields,
                    newFields
                  )
                );
              }
            } else if (
              PropertyConfigManager.getPropertyTypeFamily(p) === 'object'
            ) {
              PropertyConfigManager.adjustDataFields(
                p.value,
                oldFields,
                newFields
              );
            } else if (
              PropertyConfigManager.getPropertyTypeFamily(p) === 'scalar'
            ) {
              if (p.editorType === 'DataField' && p.value !== undefined) {
                const oldFieldIndex = oldFields.indexOf(p.value);
                if (oldFieldIndex > -1 && newFields.length > oldFieldIndex) {
                  p.value = newFields[oldFieldIndex];
                }
              }
            }
          }
          if (p.properties && p.properties.length > 0) {
            // go one level deeper
            if (p.valueTypes && p.valueTypes[0].name.indexOf('Template') >= 0) {
              // special case for ListTemplate properties
              const templateProperty = p.properties.find(
                tp => tp.name === 'template'
              );
              if (
                templateProperty !== undefined &&
                templateProperty.value !== undefined
              ) {
                PropertyConfigManager.adjustDataFields(
                  templateProperty.value,
                  oldFields,
                  newFields
                );
              }
            } else {
              PropertyConfigManager.adjustDataFields(p, oldFields, newFields);
            }
          }
        }
      });
    }
  }
}
