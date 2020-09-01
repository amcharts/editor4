import React, { Component } from 'react';
import { observer } from 'mobx-react';
import IPropertyEditorProps from '../IPropertyEditorProps';
import PropertyEditorHelpers from '../PropertyEditorHelpers';
import Property from '../../../../classes/Property';
import { Button, Intent, Popover } from '@blueprintjs/core';
import { css, StyleClass, StyleSelector } from '../../../../utils/Style';
import IValueType from '../../../../classes/IValueType';
import TypeSelectionMenu from '../TypeSelectionMenu';
import ConfirmationDialog from '../../../core/ConfirmationDialog';

const objectEditorBoxStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`);

const objectEditorObjectStyle = new StyleClass(css`
  flex-grow: 2;
  overflow: hidden;
`);
const objectEditorObjectButtonStyle = new StyleClass(css`
  overflow: hidden;
  white-space: nowrap;
`);
new StyleSelector(
  `.${objectEditorObjectButtonStyle.className}:link, .${objectEditorObjectButtonStyle.className}:visited`,
  css`
    text-decoration: none;
  `
);

@observer
class ObjectEditor extends Component<IPropertyEditorProps> {
  public constructor(props: Readonly<IPropertyEditorProps>) {
    super(props);

    this.handleAddItemClick = this.handleAddItemClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleRemoveItemClick = this.handleRemoveItemClick.bind(this);
  }

  public render() {
    const p = this.props.property;
    if (p.value !== undefined) {
      return (
        <div className={objectEditorBoxStyle.className}>
          <div className={objectEditorObjectStyle.className}>
            <a
              href="#details"
              className={objectEditorObjectButtonStyle.className}
              title={PropertyEditorHelpers.getDisplayString(
                p,
                this.props.editorState.language
              )}
              onClick={event => {
                event.preventDefault();
                this.handleItemClick(p);
              }}
            >
              {PropertyEditorHelpers.getDisplayString(
                p,
                this.props.editorState.language
              )}
            </a>
          </div>
          <div>
            <Popover
              content={
                <ConfirmationDialog
                  title="Remove?"
                  confirmText="Remove"
                  onConfirmClick={() => this.handleRemoveItemClick(p)}
                />
              }
            >
              <Button
                small={true}
                minimal={true}
                icon="cross"
                intent={Intent.NONE}
              />
            </Popover>
          </div>
        </div>
      );
    } else if (p.valueTypes && p.valueTypes.length === 1) {
      return (
        <div className={objectEditorBoxStyle.className}>
          &nbsp;
          <Button
            icon="plus"
            small={true}
            title="create"
            minimal={true}
            intent={Intent.SUCCESS}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onClick={() => this.handleAddItemClick(p, p.valueTypes![0])}
          />
        </div>
      );
    } else if (p.valueTypes && p.valueTypes.length > 1) {
      return (
        <div className={objectEditorBoxStyle.className}>
          &nbsp;
          <Popover
            position="auto"
            minimal={true}
            content={
              <TypeSelectionMenu
                property={p}
                onItemClick={this.handleAddItemClick}
              />
            }
          >
            <Button
              icon="plus"
              small={true}
              title="create"
              minimal={true}
              intent={Intent.SUCCESS}
            />
          </Popover>
        </div>
      );
    }
  }

  private handleItemClick(property: Property) {
    if (this.props.onCurrentPropertyChange) {
      // @todo make this dependent on actual underlying properties being set
      property.isUserSet = true;
      this.props.onCurrentPropertyChange(property.value);
    }
  }

  private handleAddItemClick(p: Property, itemType: IValueType) {
    if (this.props.onNewObjectItemValue !== undefined) {
      this.props.onNewObjectItemValue(p, itemType);
      this.handleItemClick(p);
    }
  }

  private handleRemoveItemClick(p: Property) {
    if (this.props.onNewObjectItemValue !== undefined) {
      this.props.onNewObjectItemValue(p, undefined);
    }
  }
}

export default ObjectEditor;
