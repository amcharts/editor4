import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Button, Popover, Intent } from '@blueprintjs/core';

import Property from '../../../classes/Property';

import editorTheme from './../../../themes/editor/EditorTheme';
import { StyleClass, css } from '../../../utils/Style';
import PropertyEditorHelpers from './PropertyEditorHelpers';
import IPropertyEditorProps from './IPropertyEditorProps';
import IValueType from '../../../classes/IValueType';
import TypeSelectionMenu from './TypeSelectionMenu';
import { observable } from 'mobx';

const propertyEditorStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
`);

const propertyEditorLabelStyle = new StyleClass(css`
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${editorTheme.propertyPanelGridColor};
  padding: 0px 0.3em 0px 1em;
`);

const propertyEditorEditStyle = new StyleClass(css`
  border-top: 1px dashed ${editorTheme.propertyPanelGridColor};
  padding: 10px 0.3em;
  width: 50%;
  display: flex;
  justify-content: flex-end;
`);

const editorLabelTextStyle = new StyleClass(css`
  display: flex;
  cursor: pointer;
`);

const labelStyle = new StyleClass(css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
`);

@observer
class TemplatePropertyPanel extends Component<IPropertyEditorProps> {
  @observable private isOpen = false;

  public constructor(props: Readonly<IPropertyEditorProps>) {
    super(props);
    this.changeCurrentProperty = this.changeCurrentProperty.bind(this);
    this.addTemplate = this.addTemplate.bind(this);
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
          <div className={editorLabelTextStyle.className}>
            <div
              className={labelStyle.className}
              title={`${displayName} (${p.name})`}
            >
              {displayName}
            </div>
          </div>
        </div>
        <div className={propertyEditorEditStyle.className}>
          {this.getTemplateButton(p)}
        </div>
      </div>
    );
  }

  private changeCurrentProperty(
    property: Property,
    templateProperty: Property
  ) {
    if (this.props.onCurrentPropertyChange) {
      this.props.onCurrentPropertyChange(
        property,
        templateProperty,
        this.props.property
      );
    }
  }

  private addTemplate(p: Property, itemType: IValueType) {
    if (this.props.onAddListItem !== undefined) {
      this.props.onAddListItem(p, itemType, true);
      const templateProperty = p.properties
        ? p.properties.find(tp => tp.name === 'template')
        : undefined;
      if (templateProperty && templateProperty.value !== undefined) {
        this.changeCurrentProperty(templateProperty.value, templateProperty);
      }
    }
  }

  // @todo: extract to a separate component as it's redundant between template/list
  private getTemplateButton(p: Property): JSX.Element {
    const templateProperty = p.properties
      ? p.properties.find(tp => tp.name === 'template')
      : undefined;

    const valueTypeCount =
      p.valueTypes && p.valueTypes.length > 0 && p.valueTypes[0].subTypes
        ? p.valueTypes[0].subTypes.length
        : -1;

    if (templateProperty && templateProperty.value !== undefined) {
      return (
        <Button
          small={true}
          minimal={true}
          rightIcon="settings"
          title="template"
          intent={Intent.NONE}
          onClick={() =>
            this.changeCurrentProperty(templateProperty.value, templateProperty)
          }
        />
      );
    } else if (valueTypeCount > 1) {
      return (
        <Popover
          position="auto"
          minimal={true}
          content={
            <TypeSelectionMenu
              property={p}
              forTemplate={true}
              onItemClick={this.addTemplate}
            />
          }
        >
          <Button
            small={true}
            minimal={true}
            icon="settings"
            title="template"
            intent="primary"
          />
        </Popover>
      );
    } else if (valueTypeCount === 1) {
      return (
        <Button
          small={true}
          minimal={true}
          icon="settings"
          title="template"
          intent="primary"
          onClick={() =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.addTemplate(p, p.valueTypes![0].subTypes![0])
          }
        />
      );
    } else {
      return <span />;
    }
  }
}

export default TemplatePropertyPanel;
