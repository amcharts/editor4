import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Switch } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';
import { StyleClass, css } from '../../../../utils/Style';

const booleanEditorStyle = new StyleClass(css`
  display: flex;
`);
const switchControlStyle = new StyleClass(css`
  margin: 5px 0px;
`);
@observer
class BooleanEditor extends Component<IPropertyEditorProps> {
  public render() {
    const p = this.props.property;
    return (
      <div className={booleanEditorStyle.className}>
        <Switch
          checked={p.value !== undefined ? p.value : false}
          className={switchControlStyle.className}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (this.props.onPropertyValueChange) {
              this.props.onPropertyValueChange(p, {
                newValue: event.target.checked
              });
            }
          }}
        />
      </div>
    );
  }
}

export default BooleanEditor;
