import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { IOptionProps, HTMLSelect, Checkbox } from '@blueprintjs/core';

import Property from '../../../classes/Property';

import editorTheme from './../../../themes/editor/EditorTheme';
import { StyleClass, css } from '../../../utils/Style';
import PropertyEditorHelpers from './PropertyEditorHelpers';
import IPropertyEditorProps from './IPropertyEditorProps';
import PropertyConfigManager from '../../../classes/PropertyConfigManager';

const propertyEditorListStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  border-top: 1px dashed ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorListLabelStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${editorTheme.propertyPanelGridColor};
  padding: 0.3em 0px;
`);

const propertyEditorListItemListStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.3em 0px;
`);

// const propertyEditorListItemRowStyle = new StyleClass(css`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   align-items: stretch;
// `);

// const propertyEditorListItemObjectStyle = new StyleClass(css`
//   flex-grow: 2;
//   overflow: hidden;
// `);

// const propertyEditorListItemObjectButtonStyle = new StyleClass(css`
//   overflow: hidden;
//   white-space: nowrap;
// `);
// new StyleSelector(
//   `.${propertyEditorListItemObjectButtonStyle.className}:link, .${
//     propertyEditorListItemObjectButtonStyle.className
//   }:visited`,
//   css`
//     text-decoration: none;
//   `
// );

const propertyEditorStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorLabelStyle = new StyleClass(css`
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0.3em 10px 1em;
`);

const propertyEditorEditStyle = new StyleClass(css`
  padding: 10px 0.3em 10px 0.3em;
  width: 50%;
`);

const labelStyle = new StyleClass(css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
`);

@observer
class ElementRefPanel extends Component<IPropertyEditorProps> {
  public constructor(props: Readonly<IPropertyEditorProps>) {
    super(props);

    this.isOptionChecked = this.isOptionChecked.bind(this);
  }

  public render() {
    const p = this.props.property;
    const displayName = PropertyEditorHelpers.getDisplayName(
      p,
      this.props.editorState.language
    );
    const valueOptions: IOptionProps[] = [];
    if (p.editorType === 'ChartElementReference') {
      valueOptions.push({ label: '(not set)', value: -1 });
    }

    const list: Property[] =
      this.props.editorState.chartProperties !== undefined
        ? PropertyConfigManager.getChartElementsForReference(
            this.props.editorState.chartProperties,
            this.props.property
          )
        : [];

    list.forEach((el, elIndex) => {
      let optionValue = '';
      const idPropValue = el.getStringPropertyValue('id');
      if (idPropValue !== undefined) {
        optionValue = idPropValue;
      }
      valueOptions.push({
        label: `${PropertyEditorHelpers.getDisplayName(
          el,
          this.props.editorState.language
        )}${optionValue !== '' ? ' (' + optionValue + ')' : ''}`,
        value: elIndex
      });
    });

    const editorStyle =
      p.editorType !== 'ChartElementReference'
        ? propertyEditorListStyle
        : propertyEditorStyle;

    const editorLabelStyle =
      p.editorType !== 'ChartElementReference'
        ? propertyEditorListLabelStyle
        : propertyEditorLabelStyle;

    return (
      <div key={p.name} className={editorStyle.className}>
        <div className={editorLabelStyle.className}>
          <div
            className={labelStyle.className}
            title={`${displayName} (${p.name})`}
          >
            {displayName}
          </div>
        </div>
        {p.editorType !== 'ChartElementReference' && (
          <div className={propertyEditorListItemListStyle.className}>
            {valueOptions.map((option, optionIndex) => (
              <Checkbox
                key={option.value}
                value={option.value}
                label={option.label}
                checked={this.isOptionChecked(p, list, optionIndex)}
                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                  if (this.props.onPropertyValueChange) {
                    this.props.onPropertyValueChange(p, {
                      newValue:
                        Number.parseInt(event.currentTarget.value) === -1
                          ? null
                          : list[Number.parseInt(event.currentTarget.value)]
                    });
                  }
                }}
              />
            ))}
          </div>
        )}
        {p.editorType === 'ChartElementReference' && (
          <div className={propertyEditorEditStyle.className}>
            <HTMLSelect
              minimal={true}
              fill={true}
              value={list.findIndex(
                el => el.getStringPropertyValue('id') === p.value
              )}
              options={valueOptions}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                if (this.props.onPropertyValueChange) {
                  this.props.onPropertyValueChange(p, {
                    newValue:
                      Number.parseInt(event.currentTarget.value) === -1
                        ? null
                        : list[Number.parseInt(event.currentTarget.value)]
                  });
                }
              }}
            />
          </div>
        )}
      </div>
    );
  }

  private isOptionChecked(
    property: Property,
    valueList: Property[],
    currentIndex: number
  ): boolean {
    const currentValue = valueList[currentIndex];
    const currentId = currentValue.getStringPropertyValue('id');

    return (
      currentId !== undefined &&
      currentId !== '' &&
      property.value !== undefined &&
      property.value.indexOf(currentId) >= 0
    );
  }
}

export default ElementRefPanel;
