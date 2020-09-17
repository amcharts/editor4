import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Button, Popover, Menu, MenuItem } from '@blueprintjs/core';

import Property from '../../../classes/Property';

import editorTheme from './../../../themes/editor/EditorTheme';
import { StyleClass, css } from '../../../utils/Style';
import StringEditor from './editors/StringEditor';
import BooleanEditor from './editors/BooleanEditor';
import NumberEditor from './editors/NumberEditor';
import IPropertyEditorProps from './IPropertyEditorProps';
import PropertyEditorHelpers from './PropertyEditorHelpers';
import ObjectEditor from './editors/ObjectEditor';
import SelectEditor from './editors/SelectEditor';
import SimpleArrayEditor from './editors/SimpleArrayEditor';
import ReadOnlyEditor from './editors/ReadOnlyEditor';
import DataFieldEditor from './editors/DataFieldEditor';
import ColorEditor from './editors/ColorEditor';

const propertyEditorStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorLabelStyle = new StyleClass(css`
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0.3em 10px 1em;
`);

const propertyEditorEditStyle = new StyleClass(css`
  padding: 10px 0.3em 10px 0.3em;
  width: 50%;
`);

const labelStyle = new StyleClass(css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
`);

@observer
class SinglePropertyPanel extends Component<IPropertyEditorProps> {
  public constructor(props: Readonly<IPropertyEditorProps>) {
    super(props);
    this.getPropertyEditor = this.getPropertyEditor.bind(this);
  }

  public render() {
    const p = this.props.property;
    const displayName = PropertyEditorHelpers.getDisplayName(
      p,
      this.props.editorState.language
    );
    return (
      <div key={p.name} className={propertyEditorStyle.className}>
        <div className={propertyEditorLabelStyle.className}>
          <div
            className={labelStyle.className}
            title={`${displayName} (${p.name})`}
          >
            {displayName}
          </div>
          {(p.isSet || p.isUserSet) && (
            <Popover
              position="auto-end"
              content={
                <Menu key="menu">
                  <MenuItem
                    icon="delete"
                    text="Reset to default"
                    onClick={() => {
                      if (this.props.onPropertyValueChange) {
                        this.props.onPropertyValueChange(p, {
                          resetToDefault: true
                        });
                      }
                    }}
                  />
                  <MenuItem
                    icon="refresh"
                    text="Reset to original"
                    onClick={() => {
                      if (this.props.onPropertyValueChange) {
                        this.props.onPropertyValueChange(p, {
                          resetToOriginal: true
                        });
                      }
                    }}
                    disabled={p.isSet !== true}
                  />
                </Menu>
              }
            >
              <Button
                small={true}
                minimal={true}
                icon="dot"
                intent={p.isUserSet ? 'success' : p.isSet ? 'primary' : 'none'}
              />
            </Popover>
          )}
        </div>
        <div className={propertyEditorEditStyle.className}>
          {this.getPropertyEditor(p)}
        </div>
      </div>
    );
  }

  /**
   * Return specific editor based on property type.
   *
   * @private
   * @param {Property} p
   * @returns {JSX.Element}
   */
  private getPropertyEditor(p: Property): JSX.Element {
    switch (p.editorType) {
      case 'string':
      case 'number--string':
      case 'NumberFormatOptions--string':
      case 'any': {
        return (
          <StringEditor
            key={p.name}
            property={p}
            editorState={this.props.editorState}
            onPropertyValueChange={this.props.onPropertyValueChange}
          />
        );
      }
      case 'boolean': {
        return (
          <BooleanEditor
            key={p.name}
            property={p}
            editorState={this.props.editorState}
            onPropertyValueChange={this.props.onPropertyValueChange}
          />
        );
      }
      case 'number':
      case 'number--undefined':
      case 'Percent--number': {
        return (
          <NumberEditor
            key={p.name}
            property={p}
            acceptPercent={p.editorType === 'Percent--number'}
            editorState={this.props.editorState}
            onPropertyValueChange={this.props.onPropertyValueChange}
          />
        );
      }
      case 'PropertyFields':
      case 'object': {
        return <ObjectEditor {...this.props} />;
      }
      case 'select': {
        return (
          <SelectEditor
            key={p.name}
            property={p}
            editorState={this.props.editorState}
            onPropertyValueChange={this.props.onPropertyValueChange}
          />
        );
      }
      case 'Color':
      case 'Color--LinearGradient--Pattern--RadialGradient': {
        // @todo implement proper editor - string editor for now
        return (
          <ColorEditor
            key={p.name}
            property={p}
            editorState={this.props.editorState}
            onPropertyValueChange={this.props.onPropertyValueChange}
          />
        );
      }
      case 'Array': {
        return (
          <SimpleArrayEditor
            key={p.name}
            property={p}
            editorState={this.props.editorState}
            onPropertyValueChange={this.props.onPropertyValueChange}
          />
        );
      }
      case 'readonly': {
        return (
          <ReadOnlyEditor
            key={p.name}
            property={p}
            editorState={this.props.editorState}
          />
        );
      }
      case 'DataField': {
        return (
          <DataFieldEditor
            key={p.name}
            property={p}
            editorState={this.props.editorState}
            onPropertyValueChange={this.props.onPropertyValueChange}
          />
        );
      }
      default: {
        return <small>{p.editorType} unsupported</small>;
      }
    }
  }
}

export default SinglePropertyPanel;
