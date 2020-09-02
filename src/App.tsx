import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps,
  Redirect
} from 'react-router-dom';

import PropertyConfigManager from './classes/PropertyConfigManager';
import { row, column, stretch } from './utils/Prefixes';
import { StyleClass, css } from './utils/Style';
import Property from './classes/Property';
import Version from './classes/Version';

import Home from './components/modules/home/Home';
import ModuleBar from './components/core/ModuleBar';
import Design from './components/modules/design/Design';
import Header from './components/core/Header';

import editorTheme from './themes/editor/EditorTheme';
import IValueType from './classes/IValueType';
import defaults from './classes/PropertyDefaults';
import Code from './components/modules/code/Code';
import Data from './components/modules/data/Data';
import { observer } from 'mobx-react';
import IConfig from './classes/IConfig';
import Loader from './components/modules/loader/Loader';
import IdHelper from './classes/IdHelper';
import EditorState from './components/core/EditorState';
import SpinnerView from './components/core/SpinnerView';
import ConfigManager from './classes/ConfigManager';
import { computed, observable, action } from 'mobx';

const appStyle = new StyleClass(
  row,
  css`
    margin: 0px;
    padding: 0px;
    height: 100%;
    height: 100vh;
    background: ${editorTheme.background};
    flex-wrap: nowrap;
    justify-content: flex-start;
  `
);

const mainBlockStyle = new StyleClass(
  column,
  stretch,
  css`
    overflow: hidden;
    background-color: ${editorTheme.background};
  `
);

@observer
class App extends Component {
  private editorState = new EditorState();

  @observable redirect = '';
  @observable isBusy = false;

  private get editorPath(): string {
    return window.location.pathname;
  }

  public constructor(props: Readonly<{}>) {
    super(props);
  }

  async componentDidMount() {
    this.isBusy = true;
    await defaults.init();
    this.setupLauncherComms();
    this.isBusy = false;
  }

  @action.bound
  private setConfig(config: IConfig) {
    if (config) {
      if (config.templates) {
        this.editorState.editorConfig.templates = config.templates;
      } else if (config.allowDefaultTemplates) {
        this.editorState.editorConfig.templates = ConfigManager.getDefaultTemplates();
      }

      if (config.enabledModules) {
        this.editorState.editorConfig.enabledModules = config.enabledModules;
      }

      if (config.engineConfig) {
        this.editorState.editorConfig.engineConfig = config.engineConfig;

        if (
          config.engineConfig.appliedThemes &&
          config.engineConfig.appliedThemes.length > 0
        ) {
          this.editorState.appliedThemes = [
            ...config.engineConfig.appliedThemes
          ];
        } else {
          this.editorState.appliedThemes = [];
        }

        if (
          config.engineConfig.licenseNumbers &&
          config.engineConfig.licenseNumbers.length > 0
        ) {
          this.editorState.licenseNumbers = [
            ...config.engineConfig.licenseNumbers
          ];
        } else {
          this.editorState.licenseNumbers = [];
        }
      }

      if (config.editorLicense) {
        this.editorState.editorConfig.editorLicense = config.editorLicense;
      }

      if (config.presetData) {
        this.editorState.presetData = config.presetData;
      }

      if (config.language) {
        this.editorState.language.translations = config.language;
      }
    }
  }

  @action.bound
  private setupLauncherComms() {
    // window or iframe
    const launcherWindow = window.opener
      ? (window.opener as Window)
      : window.parent !== window
      ? window.parent
      : null;
    if (launcherWindow) {
      window.addEventListener('message', this.receiveLauncherMessage, false);
      // post loaded message from App rather than from loader
      launcherWindow.postMessage('amcharts4-editor-loaded', '*');
    } else {
      this.loadDefaultConfig();
    }
  }

  @action.bound
  private loadDefaultConfig() {
    // set default config
    const defaultCfg = ConfigManager.getDefaultConfig();
    this.setConfig(defaultCfg);
    this.redirect = '/home';
  }

  @action.bound
  private async receiveLauncherMessage(event: MessageEvent) {
    if (event.data.messageType === 'amcharts4-editor-message') {
      if (event.data.config) {
        this.setConfig(event.data.config);
        if (event.data.config.chartConfig !== undefined) {
          await this.processChartImported(event.data.config.chartConfig);
        } else {
          this.redirect = '/home';
        }
      } else {
        this.loadDefaultConfig();
      }
    }
  }

  @action.bound
  private async processChartImported(config: IConfig) {
    if (defaults.defaultsLoaded) {
      await this.handleChartImported(config);
      this.redirect = '/design';
    } else {
      console.log('ERROR: defaults not loaded before import');
    }
  }

  // @todo comment preset data test code
  // // test preset data functionality
  // this.editorState.presetData = {
  //   data: [
  //     { cat: 'c1', val: 10 },
  //     { cat: 'c2', val: 20 },
  //     { cat: 'c3', val: 40 },
  //     { cat: 'c4', val: 18 }
  //   ],
  //   templatePropertyMap: new Map([
  //     ['category', 'cat'],
  //     ['value', 'val'],
  //     ['value1', 'val']
  //   ])
  // };

  @computed private get hasLicense(): boolean {
    return (
      this.editorState.editorConfig.editorLicense !== undefined &&
      this.editorState.editorConfig.editorLicense.match(/^ED.{5,}/i) !== null
    );
  }

  public render() {
    return (
      <Router basename={this.editorPath}>
        {this.redirect !== '' && <Redirect to={this.redirect} />}
        <SpinnerView isBusy={this.isBusy} />
        <div className={appStyle.className}>
          <Route
            path="/"
            exact
            component={(p: RouteComponentProps) => <Loader />}
          />
          <ModuleBar editorState={this.editorState} />
          <div className={mainBlockStyle.className}>
            <Header
              actionButtonsEnabled={
                window.opener
                  ? window.opener !== null
                  : window.parent !== window
              }
              showLogo={!this.hasLicense}
              handleActionButtonClick={this.handleActionButtonClick}
            />

            <Route
              path="/home/"
              component={(p: RouteComponentProps) => (
                <Home
                  editorState={this.editorState}
                  onChartImported={this.handleChartImported}
                  {...p}
                />
              )}
            />
            <Route
              path="/design/"
              component={(routeProps: RouteComponentProps) => (
                <Design
                  editorState={this.editorState}
                  onPropertyValueChange={this.handlePropertyValueChanged}
                  onRemoveListItem={this.handleRemoveListItem}
                  onAddListItem={this.handleAddListItem}
                  onNewObjectItemValue={this.handleNewObjectItemValue}
                  onThemeChange={this.handleThemeChange}
                  onLicensesChange={this.handleLicensesChange}
                  {...routeProps}
                />
              )}
            />
            <Route
              path="/data/"
              component={(routeProps: RouteComponentProps) => (
                <Data editorState={this.editorState} {...routeProps} />
              )}
            />
            <Route
              path="/code/"
              component={(routeProps: RouteComponentProps) => (
                <Code
                  editorState={this.editorState}
                  onConfigChanged={this.handleChartImported}
                  {...routeProps}
                />
              )}
            />
          </div>
          <div
            style={{ display: 'none' }}
          >{`Editor version ${Version.getVersion()}`}</div>
        </div>
      </Router>
    );
  }

  /**
   * Convert chart and its config into editor Property
   *
   * @private
   */
  @action.bound
  private async handleChartImported(config: object) {
    this.isBusy = true;
    await this.completeChartImport(config);
    this.isBusy = false;
  }

  @action.bound
  private async completeChartImport(config: object) {
    if (defaults.defaultsLoaded) {
      [
        this.editorState.chartProperties,
        this.editorState.chartData
      ] = await PropertyConfigManager.configToProperty(
        config,
        this.editorState.presetData
      );
    }
  }

  /**
   * Handle property value changes and resets
   *
   * @private
   */
  private handlePropertyValueChanged = (
    property: Property,
    options: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newValue?: any;
      resetToOriginal?: boolean;
      resetToDefault?: boolean;
    }
  ) => {
    if (options.resetToDefault && this.editorState.chartProperties) {
      // reset to default (automatically set values)
      property.isSet = false;
      property.isUserSet = false;

      // get new Property for the updated values and run through it to update current values
      PropertyConfigManager.configToProperty(
        PropertyConfigManager.propertyToConfig(
          this.editorState.chartProperties,
          this.editorState.chartData
        )
      ).then(result => {
        const [newProperties] = result;
        if (newProperties && this.editorState.chartProperties) {
          PropertyConfigManager.resetAutoValues(
            this.editorState.chartProperties,
            newProperties
          );
        }
      });
    } else if (options.resetToOriginal) {
      // reset to value set in config or default
      if (typeof property.value === 'string') {
        property.value =
          property.autoValue !== undefined ? property.autoValue : '';
      } else {
        property.value = property.autoValue;
      }
      property.isUserSet = false;
    } else if (property.editorType.startsWith('ChartElementReference')) {
      if (options.newValue === null) {
        property.value = undefined;
      } else if (
        options.newValue !== undefined &&
        options.newValue instanceof Property
      ) {
        let idValue = options.newValue.getStringPropertyValue('id');
        if (
          (idValue === undefined || idValue === '') &&
          this.editorState.chartProperties !== undefined
        ) {
          // create new id
          const idHelper = new IdHelper();
          idHelper.init(
            PropertyConfigManager.propertyToConfig(
              this.editorState.chartProperties
            )
          );
          idValue = idHelper.getNewId();
          options.newValue.setStringPropertyValue('id', idValue);
        }

        if (idValue !== undefined) {
          if (property.editorType === 'ChartElementReference') {
            property.value = idValue;
          } else {
            const valueIndex = (property.value as string[]).indexOf(idValue);
            if (valueIndex >= 0) {
              // remove
              (property.value as string[]).splice(valueIndex, 1);
            } else {
              (property.value as string[]).push(idValue);
            }
          }
        }

        property.isUserSet = true;
      }
    } else {
      // @todo: why was this undefined check here?
      // if (options.newValue !== undefined)
      // just set the value
      property.value = options.newValue;
      property.isUserSet = true;
    }
  };

  /**
   * Handle when items are removed from List-type properties
   *
   * @private
   */
  private handleRemoveListItem = (property: Property, listItem: Property) => {
    const list = property.value as Property[];

    list.splice(list.indexOf(listItem), 1);
  };

  /**
   * Add item to List-type property
   *
   * @private
   */
  private handleAddListItem = (
    property: Property,
    itemType: IValueType,
    forTemplate?: boolean,
    itemName?: string // used only for states for now
  ) => {
    const newItem = defaults.getDefaults(itemType.name);
    if (newItem !== undefined) {
      if (itemName !== undefined && newItem.properties) {
        const nameProperty = newItem.properties.find(np => np.name === 'name');
        if (nameProperty !== undefined) {
          nameProperty.value = itemName;
        }
        if (property.name === 'states') {
          // special case for states
          if (itemType.subTypes) {
            const propertiesProperty = newItem.properties.find(
              np => np.name === 'properties'
            );
            if (propertiesProperty && propertiesProperty.valueTypes) {
              propertiesProperty.editorType = 'object';
              propertiesProperty.valueTypes[0] = itemType.subTypes[0];
            }
          }
        }
      }
      if (forTemplate) {
        let templateProperty = property.properties
          ? property.properties.find(tp => tp.name === 'template')
          : undefined;
        if (templateProperty === undefined) {
          // create new template
          if (property.properties === undefined) {
            property.properties = new Array<Property>();
            property.value = new Array<Property>();
          }
          templateProperty = new Property({
            name: 'template',
            editorType: 'object',
            valueTypes: property.valueTypes
              ? property.valueTypes[0].subTypes
              : undefined
          });
          property.properties.push(templateProperty);
        }
        property.isUserSet = true;
        templateProperty.isUserSet = true;
        templateProperty.value = new Property(newItem);
      } else {
        if (property.value === undefined) {
          property.value = new Array<Property>();
        }
        property.isUserSet = true;
        const newItemProperty = new Property(newItem);
        // if (newItemProperty && newItemProperty.properties !== undefined) {
        //   const idProperty = newItemProperty.properties.find(
        //     idp => idp.name === 'id'
        //   );
        //   if (idProperty !== undefined) {
        //     idProperty.value =
        //       property.name + '-' + (property.value as Property[]).length;
        //     idProperty.isUserSet = true;
        //   }
        // }
        (property.value as Property[]).push(newItemProperty);
      }
    }
  };

  /**
   * Add new object item
   *
   * @private
   */
  private handleNewObjectItemValue = (
    property: Property,
    itemType?: IValueType
  ) => {
    if (itemType !== undefined) {
      const newItem = defaults.getDefaults(itemType.name);
      if (newItem !== undefined) {
        property.isUserSet = true;
        property.value = new Property(newItem);
      }
    } else {
      // remove property
      property.isUserSet = false;
      property.value = undefined;
    }
  };

  @action.bound
  private handleActionButtonClick = (isOk: boolean) => {
    // window or iframe
    const launcherWindow = window.opener
      ? (window.opener as Window)
      : window.parent !== window
      ? window.parent
      : null;
    if (launcherWindow) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {};
      if (isOk && this.editorState.chartProperties) {
        payload.messageType = 'amcharts4-editor-result';
        payload.config = PropertyConfigManager.propertyToConfig(
          this.editorState.chartProperties,
          this.editorState.chartData
        );
        if (this.editorState.appliedThemes) {
          payload.appliedThemes = [...this.editorState.appliedThemes];
        }
        if (this.editorState.licenseNumbers) {
          payload.licenseNumbers = [...this.editorState.licenseNumbers];
        }
      } else {
        payload.messageType = 'amcharts4-editor-cancel';
      }

      launcherWindow.postMessage(payload, '*');
    }
  };

  private handleThemeChange = (themes: {
    addThemeName?: string;
    removeThemeName?: string;
  }) => {
    if (this.editorState.appliedThemes !== undefined) {
      if (
        themes.addThemeName !== undefined &&
        this.editorState.appliedThemes.indexOf(themes.addThemeName) === -1
      ) {
        this.editorState.appliedThemes.push(themes.addThemeName);
      }
      if (
        themes.removeThemeName !== undefined &&
        this.editorState.appliedThemes.indexOf(themes.removeThemeName) > -1
      ) {
        this.editorState.appliedThemes.splice(
          this.editorState.appliedThemes.indexOf(themes.removeThemeName),
          1
        );
      }
    }
  };

  private handleLicensesChange = (licenses?: string[]) => {
    if (this.editorState.licenseNumbers !== undefined) {
      this.editorState.licenseNumbers.splice(0);
      if (licenses && licenses.length > 0) {
        this.editorState.licenseNumbers.push(...licenses);
      }
    }
  };
}

export default App;
