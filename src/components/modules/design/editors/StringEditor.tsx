import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputGroup } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';

@observer
class StringEditor extends Component<IPropertyEditorProps> {
  public render() {
    const p = this.props.property;
    return (
      <InputGroup
        small={true}
        value={p.value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (this.props.onPropertyValueChange) {
            this.props.onPropertyValueChange(p, {
              newValue: event.target.value
            });
          }
        }}
      />
    );
  }
}

export default StringEditor;
