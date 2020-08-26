import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputGroup, Popover } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';
import { SketchPicker, ColorResult } from 'react-color';
import { action } from 'mobx';

@observer
class ColorEditor extends Component<IPropertyEditorProps> {
  public render() {
    const p = this.props.property;
    return (
      <Popover
        content={
          <SketchPicker
            color={p.value}
            disableAlpha={true}
            presetColors={[]}
            onChangeComplete={this.handleColorPickerChange}
          />
        }
      >
        <InputGroup
          small={true}
          leftElement={
            <span
              className="bp3-icon"
              style={{ backgroundColor: p.value, width: 20 }}
            >
              &nbsp;
            </span>
          }
          value={p.value !== undefined ? p.value : ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (this.props.onPropertyValueChange) {
              this.props.onPropertyValueChange(p, {
                newValue: event.target.value
              });
            }
          }}
        />
      </Popover>
    );
  }

  // @action.bound
  // private handleTextClick(event: React.MouseEvent<HTMLInputElement>) {
  //   alert("zzz");
  // }

  @action.bound
  private handleColorPickerChange(result: ColorResult) {
    if (this.props.onPropertyValueChange) {
      this.props.onPropertyValueChange(this.props.property, {
        newValue: result.hex
      });
    }
  }
}

export default ColorEditor;
