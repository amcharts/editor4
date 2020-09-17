import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { StyleClass, css } from '../../../utils/Style';
import IBaseProps from '../../core/IBaseProps';

import PropertyGroup from './PropertyGroup';
import PropertyGroupFactory from '../../../classes/PropertyGroupFactory';
import { InputGroup, Button, IPanelProps } from '@blueprintjs/core';
import Property from '../../../classes/Property';
import PropertyGridState from './PropertyGridState';

const propertySetPanelStyle = new StyleClass(css`
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow-y: scroll;
  flex-grow: 2;
`);

const propertyFilterStyle = new StyleClass(css`
  width: 100%;
  padding: 1em 5px 1em 1em;
`);

export interface IPropertyGridProps extends IBaseProps, IPanelProps {
  currentProperty?: Property;
  gridState: PropertyGridState;
  onFilterChange: (filter: string) => void;
  onGroupExpandedChange: (groupName: string) => void;
  onPropertyExpandedChange: (propertyName: string) => void;
}

@observer
class PropertyGrid extends Component<IPropertyGridProps> {
  public constructor(props: Readonly<IPropertyGridProps>) {
    super(props);
  }

  public render() {
    const lang = this.props.editorState.language;

    const groups = PropertyGroupFactory.getDefaultPropertyGroupSet();

    const fitlerResetButton =
      this.props.gridState.filter !== '' ? (
        <Button
          icon="cross"
          minimal={true}
          onClick={() => {
            this.props.onFilterChange('');
          }}
        />
      ) : (
        undefined
      );

    const { onCurrentPropertyChange, ...baseProps } = this.props;

    return (
      <>
        <div className={propertyFilterStyle.className}>
          <InputGroup
            value={this.props.gridState.filter}
            leftIcon="filter"
            placeholder={lang.getUiTranslation(
              'property_grid.filter_properties',
              'Filter properties...'
            )}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              this.props.onFilterChange(event.target.value);
            }}
            rightElement={fitlerResetButton}
          />
        </div>

        <div key="properties" className={propertySetPanelStyle.className}>
          {groups.map(g => (
            <PropertyGroup
              key={`group--${
                this.props.currentProperty
                  ? this.props.currentProperty.name
                  : ''
              }--${g.name}`}
              group={g}
              groupProperties={
                this.props.currentProperty &&
                this.props.currentProperty.properties
                  ? this.props.currentProperty.properties
                      .filter(p => p.groupName === g.name)
                      .sort((p1, p2) => (p1.orderNo > p2.orderNo ? 1 : -1))
                  : undefined
              }
              filter={this.props.gridState.filter}
              onCurrentPropertyChange={this.props.onCurrentPropertyChange}
              isExpanded={this.props.gridState.groupExpandedStates[g.name]}
              onExpandedChange={this.props.onGroupExpandedChange}
              onPropertyExpandedChange={this.props.onPropertyExpandedChange}
              {...baseProps}
            />
          ))}
        </div>
      </>
    );
  }
}

export default PropertyGrid;
