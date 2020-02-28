import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { HTMLSelect, IOptionProps } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';
import { computed } from 'mobx';

@observer
class DataFieldEditor extends Component<IPropertyEditorProps> {
  @computed get dataFields(): IOptionProps[] {
    const result: IOptionProps[] = [{ label: '(not set)', value: -1 }];
    if (
      this.props.editorState.chartData !== undefined &&
      this.props.editorState.chartData.length > 0
    ) {
      Object.keys(this.props.editorState.chartData[0]).forEach(field => {
        result.push({ label: field, value: field });
      });
    }
    return result;
  }
  public render() {
    const p = this.props.property;
    if (this.dataFields !== undefined) {
      return (
        <HTMLSelect
          minimal={true}
          fill={true}
          value={p.value}
          options={this.dataFields}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            if (this.props.onPropertyValueChange) {
              this.props.onPropertyValueChange(p, {
                newValue:
                  Number.parseInt(event.currentTarget.value) === -1
                    ? undefined
                    : event.currentTarget.value
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

export default DataFieldEditor;
