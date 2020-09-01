import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { StyleClass, css } from '../../../utils/Style';
import IBaseProps from '../../core/IBaseProps';

import editorTheme from './../../../themes/editor/EditorTheme';
import Property from '../../../classes/Property';
import { observable } from 'mobx';
import PropertyGrid from './PropertyGrid';
import { PanelStack, IPanel, Button } from '@blueprintjs/core';
import PropertyEditorHelpers from './PropertyEditorHelpers';
import PropertyGridState from './PropertyGridState';
import EngineSettingsPanel from './EngineSettingsPanel';

const propertyPanelStyle = new StyleClass(css`
  background: ${editorTheme.propertyPanelBackground};

  max-width: 30%;
  min-width: 200px;
  width: 30%;
  padding: 0px;

  display: flex;
  flex-direction: column;

  max-height: 100%;
  overflow: hidden;
`);

const panelStackStyle = new StyleClass(css`
  flex-grow: 2;
`);

@observer
class PropertyPanel extends Component<IBaseProps> {
  @observable private currentProperty?: Property;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @observable private panelStack: Array<IPanel<any>>;
  @observable private gridStateStack: Array<PropertyGridState>;

  public constructor(props: Readonly<IBaseProps>) {
    super(props);

    this.addPanelToStack = this.addPanelToStack.bind(this);
    this.changeCurrentProperty = this.changeCurrentProperty.bind(this);
    this.goLevelBack = this.goLevelBack.bind(this);
    this.goToChartProperties = this.goToChartProperties.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleGroupExpandedChange = this.handleGroupExpandedChange.bind(this);
    this.handlePropertyExpandedChange = this.handlePropertyExpandedChange.bind(
      this
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.panelStack = new Array<IPanel<any>>();
    this.gridStateStack = new Array<PropertyGridState>();
  }

  public componentDidMount() {
    if (
      this.currentProperty === undefined &&
      this.props.editorState.chartProperties !== undefined
    ) {
      this.currentProperty = this.props.editorState.chartProperties;
      // add initial panel
      this.addPanelToStack(this.currentProperty);
    }
  }

  private addPanelToStack(property: Property) {
    const newGridState = new PropertyGridState();
    newGridState.groupExpandedStates['main'] = true;
    this.gridStateStack.push(newGridState);

    const newPanel = {
      component: PropertyGrid,
      props: {
        currentProperty: property,
        onCurrentPropertyChange: this.changeCurrentProperty,
        gridState: newGridState,
        onFilterChange: this.handleFilterChange,
        onGroupExpandedChange: this.handleGroupExpandedChange,
        onPropertyExpandedChange: this.handlePropertyExpandedChange,
        ...this.props
      },
      title: PropertyEditorHelpers.getDisplayName(
        property,
        this.props.editorState.language
      )
    };
    this.panelStack = [...this.panelStack, newPanel];
  }

  public render() {
    return (
      <div
        className={`${propertyPanelStyle.className} ${editorTheme.uiLibThemeClassName}`}
      >
        {this.props.editorState.chartProperties && (
          <Button
            text={PropertyEditorHelpers.getDisplayName(
              this.props.editorState.chartProperties,
              this.props.editorState.language
            )}
            minimal={true}
            large={true}
            icon="chart"
            onClick={this.goToChartProperties}
          />
        )}
        {this.panelStack.length === 1 && (
          <EngineSettingsPanel
            gridState={this.gridStateStack[0]}
            onExpandedChange={this.handleGroupExpandedChange}
            {...this.props}
          />
        )}
        {this.panelStack.length > 0 && (
          <PanelStack
            className={panelStackStyle.className}
            showPanelHeader={this.panelStack.length > 1}
            stack={this.panelStack}
            onClose={this.goLevelBack}
          />
        )}
      </div>
    );
  }

  /**
   * Handle Property tree navigation.
   *
   * @param {Property} property
   * @param {Property} [listProperty]
   */
  public changeCurrentProperty(
    property: Property,
    ...pathProperties: Property[]
  ) {
    this.currentProperty = property;
    // @todo temp workaround - make that isUserSet is actually dependend on properties of a child being set
    this.currentProperty.isUserSet = true;
    if (pathProperties !== undefined) {
      pathProperties.forEach(pathP => {
        pathP.isUserSet = true;
      });
    }

    this.addPanelToStack(this.currentProperty);
  }

  private goLevelBack() {
    this.panelStack.splice(this.panelStack.length - 1);
    this.panelStack = [...this.panelStack];
    this.gridStateStack.pop();
  }

  private goToChartProperties() {
    this.panelStack = [this.panelStack[0]];
    this.gridStateStack.splice(1);
  }

  private handleFilterChange(newFilter: string) {
    this.gridStateStack[this.gridStateStack.length - 1].filter = newFilter;
  }

  private handleGroupExpandedChange(groupName: string) {
    this.gridStateStack[this.gridStateStack.length - 1].groupExpandedStates[
      groupName
    ] = this.gridStateStack[this.gridStateStack.length - 1].groupExpandedStates[
      groupName
    ]
      ? false
      : true;
  }

  private handlePropertyExpandedChange(propertyName: string) {
    this.gridStateStack[this.gridStateStack.length - 1].propertyExpandedStates[
      propertyName
    ] = this.gridStateStack[this.gridStateStack.length - 1]
      .propertyExpandedStates[propertyName]
      ? false
      : true;
  }
}

export default PropertyPanel;
