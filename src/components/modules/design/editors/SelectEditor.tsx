import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { HTMLSelect } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';
import literalListTypes from '../../../../classes/literalListTypeValues';
import IValueType from '../../../../classes/IValueType';
import Property from '../../../../classes/Property';

@observer
class SelectEditor extends Component<IPropertyEditorProps> {
  private getStringValue(p: Property): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result = p.value !== undefined ? (p.value as any).toString() : '';
    if (typeof p.value === 'function') {
      if ((p.value as Function).name && p.valueTypes) {
        const valueOptions = this.getValueOptions(p.valueTypes);
        if (valueOptions) {
          result = valueOptions.find(vo =>
            vo.endsWith((p.value as Function).name)
          );
        }
      } else {
        result = (p.value as Function).name;
      }
    }
    return result;
  }

  private getValueOptions(valueTypes: IValueType[]): string[] | undefined {
    if (valueTypes.length === 1) {
      return literalListTypes.getTypeValues(valueTypes[0].name);
    } else {
      // inline options
      return valueTypes.map(vt => vt.name);
    }
  }

  public render() {
    const p = this.props.property;
    let valueOptions: string[] | undefined;

    if (p.valueTypes) {
      valueOptions = this.getValueOptions(p.valueTypes);
    }

    if (valueOptions !== undefined) {
      return (
        <HTMLSelect
          minimal={true}
          fill={true}
          value={this.getStringValue(p)}
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
