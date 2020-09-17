import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { HTMLSelect, IOptionProps } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';
import { computed } from 'mobx';
import { IChartData } from '../../../core/IChartData';

@observer
class DataFieldEditor extends Component<IPropertyEditorProps> {
  @computed get dataFields(): IOptionProps[] {
    const result: IOptionProps[] = [
      {
        label: this.props.editorState.language.getUiTranslation(
          'data_field_editor.not_set',
          '(not set)'
        ),
        value: -1
      }
    ];
    if (
      this.props.editorState.chartData !== undefined &&
      this.props.editorState.chartData.length > 0
    ) {
      result.push(...this.getDataFields(this.props.editorState.chartData[0]));
    }
    // return deduped
    return result.filter(
      (el, index, self) =>
        self.findIndex(dup => dup.value === el.value) === index
    );
  }

  private getDataFields(level: IChartData): IOptionProps[] {
    const result: IOptionProps[] = [];
    Object.keys(level).forEach(field => {
      result.push({ label: field, value: field });
      if (Array.isArray(level[field]) && level[field].length > 0) {
        result.push(...this.getDataFields(level[field][0]));
      }
    });

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
