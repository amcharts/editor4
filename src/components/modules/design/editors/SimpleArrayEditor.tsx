import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputGroup } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';
import { observable } from 'mobx';

@observer
class SimpleArrayEditor extends Component<IPropertyEditorProps> {
  @observable private currentValue = '';

  public componentDidMount() {
    const p = this.props.property;
    if (this.currentValue === '') {
      this.currentValue =
        p.value !== undefined ? (p.value as []).join(',') : '';
    }
  }

  public render() {
    return (
      <InputGroup
        small={true}
        value={this.currentValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const p = this.props.property;
          if (
            this.props.onPropertyValueChange &&
            event.target.value !== undefined &&
            event.target.value !== ''
          ) {
            this.currentValue = event.target.value;
            const newArray = event.target.value.split(',');
            const newValue = newArray.map(v => v.trim()).filter(v => v !== '');
            this.props.onPropertyValueChange(p, {
              newValue: newValue
            });
          }
        }}
      />
    );
  }
}

export default SimpleArrayEditor;
