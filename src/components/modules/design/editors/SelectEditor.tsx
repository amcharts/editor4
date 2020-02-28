import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { HTMLSelect } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';
import literalListTypes from '../../../../classes/literalListTypeValues';

@observer
class SelectEditor extends Component<IPropertyEditorProps> {
  public render() {
    const p = this.props.property;
    let valueOptions: string[] | undefined;

    if (p.valueTypes) {
      if (p.valueTypes.length === 1) {
        valueOptions = literalListTypes.getTypeValues(p.valueTypes[0].name);
      } else {
        // inline options
        valueOptions = p.valueTypes.map(vt => vt.name);
      }
    }

    if (valueOptions !== undefined) {
      return (
        <HTMLSelect
          minimal={true}
          fill={true}
          value={p.value}
          options={valueOptions}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            if (this.props.onPropertyValueChange) {
              this.props.onPropertyValueChange(p, {
                newValue: event.currentTarget.value
              });
            }
          }}
        />
      );
    } else {
      return <span>can't find values</span>;
    }
  }
}

export default SelectEditor;
