import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IOptionProps, MenuItem } from '@blueprintjs/core';
import { ItemPredicate, ItemRenderer, Suggest } from '@blueprintjs/select';
import IPropertyEditorProps from '../IPropertyEditorProps';
import { computed } from 'mobx';
import { IChartData } from '../../../core/IChartData';

const renderField: ItemRenderer<IOptionProps> = (
  option,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={option.value}
      onClick={handleClick}
      text={option.label ? option.label.toString() : ''}
    />
  );
};

const renderCreateNewItem = (
  query: string,
  active: boolean,
  handleClick: React.MouseEventHandler<HTMLElement>
) => {
  return (
    <MenuItem
      active={active}
      key={query}
      onClick={handleClick}
      text={`+ ${query}`}
    />
  );
};

const createOption = (value: string): IOptionProps => {
  return { value: value, label: value };
};

const filterFields: ItemPredicate<IOptionProps> = (
  query,
  field,
  _index,
  exactMatch
) => {
  const normalizedValue = field.value.toString().toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedValue === normalizedQuery;
  } else {
    return normalizedValue.indexOf(normalizedQuery) >= 0;
  }
};

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
      result.push(
        ...this.getDataFields(
          this.props.editorState.chartData[0],
          this.props.property.value
        )
      );
    }
    // return deduped
    return result.filter(
      (el, index, self) =>
        self.findIndex(dup => dup.value === el.value) === index
    );
  }

  private getDataFields(
    level: IChartData,
    currentValue?: string
  ): IOptionProps[] {
    const result: IOptionProps[] = [];
    Object.keys(level).forEach(field => {
      result.push({ label: field, value: field });
      if (Array.isArray(level[field]) && level[field].length > 0) {
        result.push(...this.getDataFields(level[field][0]));
      }
    });

    if (currentValue !== undefined) {
      result.push({ label: currentValue, value: currentValue });
    }

    return result;
  }

  public render() {
    const p = this.props.property;
    return (
      <Suggest
        fill={true}
        items={this.dataFields}
        selectedItem={this.dataFields.find(option => {
          return p.value !== undefined && p.value !== ''
            ? option.value === p.value
            : option.value === -1;
        })}
        inputValueRenderer={item => (item.label ? item.label : '')}
        itemsEqual={(a, b) => a.value === b.value}
        createNewItemFromQuery={createOption}
        createNewItemRenderer={renderCreateNewItem}
        itemPredicate={filterFields}
        itemRenderer={renderField}
        onItemSelect={(option: IOptionProps) => {
          if (this.props.onPropertyValueChange) {
            this.props.onPropertyValueChange(p, {
              newValue:
                Number.parseInt(option.value.toString()) === -1
                  ? undefined
                  : option.value
            });
          }
        }}
      />
    );
  }
}

export default DataFieldEditor;
