import React, { Component } from 'react';
import { observer } from 'mobx-react';

import {
  Text,
  Button,
  Popover,
  Intent,
  Menu,
  MenuItem,
  Icon,
  Collapse
} from '@blueprintjs/core';

import Property from '../../../classes/Property';

import editorTheme from './../../../themes/editor/EditorTheme';
import { StyleClass, css } from '../../../utils/Style';
import PropertyEditorHelpers from './PropertyEditorHelpers';
import IPropertyEditorProps from './IPropertyEditorProps';
import IValueType from '../../../classes/IValueType';
import { observable } from 'mobx';
import ConfirmationDialog from '../../core/ConfirmationDialog';

const propertyEditorListStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorListLabelStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${editorTheme.propertyPanelGridColor};
  padding: 0px 0.3em 0px 1em;
`);

const propertyEditorListItemListStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: column;
`);

const propertyEditorListItemRowStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-bottom: 1px solid transparent;
  padding-right: 0.3em;
  background-color: ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorListItemObjectStyle = new StyleClass(css`
  flex-grow: 2;
  overflow: hidden;
  display: flex;
  padding: 10px 0.3em 10px 1em;
  cursor: pointer;
`);
const propertyEditorListItemObjectButtonStyle = new StyleClass(css`
  color: ${editorTheme.propertyPanelAccentColor};
`);

const propertyEditorListActionRowStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0px;
`);

const propertyEditorListItemActionBoxStyle = new StyleClass(css`
  padding: 10px 0px;
`);

const editorLabelTextStyle = new StyleClass(css`
  display: flex;
  cursor: pointer;
`);

const editorLabelIconStyle = new StyleClass(css`
  margin-right: 10px;
`);

const editorListItemIconStyle = new StyleClass(css`
  margin-right: 10px;
`);

@observer
class StatesPropertyPanel extends Component<IPropertyEditorProps> {
  @observable private isOpen = false;

  public constructor(props: Readonly<IPropertyEditorProps>) {
    super(props);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.handleRemoveListItemClick = this.handleRemoveListItemClick.bind(this);
    this.handleAddItemClick = this.handleAddItemClick.bind(this);
    this.getMissingStates = this.getMissingStates.bind(this);
  }

  public render() {
    const p = this.props.property;
    const values = p.value !== undefined ? (p.value as Property[]) : [];
    return (
      <div key={p.name} className={propertyEditorListStyle.className}>
        <div className={propertyEditorListLabelStyle.className}>
          <div
            className={editorLabelTextStyle.className}
            onClick={() => (this.isOpen = !this.isOpen)}
          >
            <Icon
              icon={this.isOpen ? 'caret-down' : 'caret-right'}
              className={editorLabelIconStyle.className}
            />
            <Text ellipsize={true}>
              {PropertyEditorHelpers.getDisplayName(
                p,
                this.props.editorState.language
              )}
            </Text>
          </div>
          <div className={propertyEditorListActionRowStyle.className}>
            <div>
              {p.valueTypes &&
                p.valueTypes.length > 0 &&
                p.valueTypes[0].subTypes &&
                p.valueTypes[0].subTypes.length > 1 && (
                  <Popover
                    position="auto"
                    minimal={true}
                    content={<Menu>{this.getMissingStates(p)}</Menu>}
                  >
                    <Button
                      small={true}
                      minimal={true}
                      icon="plus"
                      title="add"
                      intent={Intent.SUCCESS}
                    />
                  </Popover>
                )}
            </div>
          </div>
        </div>
        <Collapse isOpen={this.isOpen}>
          <div className={propertyEditorListItemListStyle.className}>
            {values.map((listItem, index) => (
              <div
                key={p.name + '_' + index}
                className={propertyEditorListItemRowStyle.className}
              >
                <div
                  className={propertyEditorListItemObjectStyle.className}
                  title={PropertyEditorHelpers.getDisplayString(
                    listItem,
                    this.props.editorState.language
                  )}
                  onClick={event => {
                    this.handleListItemClick(listItem, p);
                  }}
                >
                  <Icon
                    icon="style"
                    className={editorListItemIconStyle.className}
                  />
                  <Text
                    ellipsize={true}
                    className={
                      propertyEditorListItemObjectButtonStyle.className
                    }
                  >
                    {PropertyEditorHelpers.getDisplayString(
                      listItem,
                      this.props.editorState.language
                    )}
                  </Text>
                </div>
                <div className={propertyEditorListItemActionBoxStyle.className}>
                  <Popover
                    content={
                      <ConfirmationDialog
                        title="Remove item?"
                        confirmText="Remove"
                        onConfirmClick={() =>
                          this.handleRemoveListItemClick(p, listItem)
                        }
                      />
                    }
                  >
                    <Button
                      small={true}
                      minimal={true}
                      icon="cross"
                      title="delete"
                      intent={Intent.NONE}
                    />
                  </Popover>
                </div>
              </div>
            ))}
          </div>
        </Collapse>
      </div>
    );
  }

  private handleRemoveListItemClick(p: Property, listItem: Property) {
    if (this.props.onRemoveListItem) {
      this.props.onRemoveListItem(p, listItem);
    }
  }

  private handleListItemClick(property: Property, listProperty: Property) {
    if (this.props.onCurrentPropertyChange) {
      this.props.onCurrentPropertyChange(property, listProperty);
    }
  }

  private handleAddItemClick(
    p: Property,
    itemType: IValueType,
    stateName: string
  ) {
    if (this.props.onAddListItem !== undefined) {
      this.props.onAddListItem(p, itemType, undefined, stateName);
      const currentList = p.value as Property[];
      if (currentList && currentList.length > 0) {
        this.handleListItemClick(currentList[currentList.length - 1], p);
      }
    }
  }

  private getMissingStates(statesProperty: Property): JSX.Element[] {
    let result: JSX.Element[] = [];

    const presetStates = [
      'active',
      'default',
      'down',
      'hidden',
      'hover',
      'hoverActive'
    ];
    const setStates =
      statesProperty && statesProperty.value !== undefined
        ? (statesProperty.value as Property[]).map(p => {
            if (p.properties) {
              const stateNameProp = p.properties.find(
                prop => prop.name === 'name'
              );
              if (stateNameProp) {
                return stateNameProp.value;
              }
            }
            return '';
          })
        : [];

    const stateValueType =
      statesProperty.valueTypes &&
      statesProperty.valueTypes[0].subTypes &&
      statesProperty.valueTypes[0].subTypes.length > 1
        ? statesProperty.valueTypes[0].subTypes[1]
        : undefined;

    if (stateValueType !== undefined) {
      result = presetStates.map(ps => {
        const isSetState = setStates.indexOf(ps) >= 0;
        return (
          <MenuItem
            key={ps}
            text={ps}
            disabled={isSetState}
            onClick={() =>
              this.handleAddItemClick(statesProperty, stateValueType, ps)
            }
          />
        );
      });
    }

    return result;
  }
}

export default StatesPropertyPanel;
