import React, { Component } from 'react';
import { observer } from 'mobx-react';

import IBaseProps from '../../core/IBaseProps';
import IPropertyGroup from '../../../classes/IPropertyGroup';
import Property from '../../../classes/Property';

import editorTheme from './../../../themes/editor/EditorTheme';
import { StyleClass, css, StyleSelector } from '../../../utils/Style';
import SinglePropertyPanel from './SinglePropertyPanel';

import ListPropertyPanel from './ListPropertyPanel';
import { Button, Collapse, Icon } from '@blueprintjs/core';
import { observable } from 'mobx';
import PropertyEditorHelpers from './PropertyEditorHelpers';
import StatesPropertyPanel from './StatesPropertyPanel';
import ElementRefPanel from './ElementRefPanel';
import TemplatePropertyPanel from './TemplatePropertyPanel';
import PropertyGridState from './PropertyGridState';

const propertyGroupStyle = new StyleClass(css`
  border-bottom: 1px solid ${editorTheme.propertyPanelGridColor};
  margin: 0px;
`);

const propertyGroupOpenStyle = new StyleClass(css`
  background-color: ${editorTheme.propertyPanelItemExpandedBackground};
`);

const propertyGroupTitleStyle = new StyleClass(css`
  display: flex;
  margin: 0px;
  padding: 10px 0px 10px 1em;
`);
new StyleSelector(
  `.${propertyGroupTitleStyle.className}:hover`,
  css`
    background-color: ${editorTheme.propertyPanelItemHoverBackground};
    cursor: pointer;
  `
);
new StyleSelector(
  `.${propertyGroupTitleStyle.className} h4`,
  css`
    margin: 0px;
  `
);

const propertyGroupTitleIconStyle = new StyleClass(css`
  margin-right: 10px;
  color: ${editorTheme.propertyPanelAccentColor};
`);

const expandButtonRowStyle = new StyleClass(css`
  padding-top: 0.5em;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-top: 1px dashed ${editorTheme.propertyPanelGridColor};
`);

/**
 * Props for the PropertyGroup.
 *
 * @interface IPropertyGroupProps
 * @extends {IBaseProps}
 */
interface IPropertyGroupProps extends IBaseProps {
  group: IPropertyGroup;
  groupProperties?: Property[];
  filter?: string;
  isExpanded?: boolean;
  gridState: PropertyGridState;
  onExpandedChange: (groupName: string) => void;
  onPropertyExpandedChange: (propertyName: string) => void;
}

@observer
class PropertyGroup extends Component<IPropertyGroupProps> {
  // @observable private isOpen = false; // whether group content is open at all
  @observable private isExpanded = false; // whether not core content is shown

  public constructor(props: Readonly<IPropertyGroupProps>) {
    super(props);
    this.getPropertyEditor = this.getPropertyEditor.bind(this);
    this.isPropertyVisible = this.isPropertyVisible.bind(this);
  }

  public render() {
    if (this.props.groupProperties && this.props.groupProperties.length > 0) {
      const gp = this.props.groupProperties
        .filter(p => this.isPropertyVisible(p))
        .sort((a, b) => (a.orderNo > b.orderNo ? 1 : -1));
      if (gp.length > 0 || !this.isFilterSet) {
        return (
          <div className={propertyGroupStyle.className}>
            <div
              className={propertyGroupTitleStyle.className}
              onClick={() => this.props.onExpandedChange(this.props.group.name)}
            >
              <Icon
                icon={this.props.isExpanded ? 'folder-open' : 'folder-close'}
                className={propertyGroupTitleIconStyle.className}
              />
              <h4>{this.props.group.displayName}</h4>
            </div>

            <Collapse
              isOpen={this.props.isExpanded || this.isFilterSet}
              className={propertyGroupOpenStyle.className}
            >
              {gp.map(gp => this.getPropertyEditor(gp))}
              {!this.isFilterSet && (
                <div className={expandButtonRowStyle.className}>
                  <Button
                    minimal={true}
                    small={true}
                    rightIcon={
                      this.isExpanded
                        ? 'double-chevron-up'
                        : 'double-chevron-down'
                    }
                    onClick={() => {
                      this.isExpanded = !this.isExpanded;
                    }}
                  >
                    {this.isExpanded ? 'show less' : 'show more'}
                  </Button>
                </div>
              )}
            </Collapse>
          </div>
        );
      }
    }

    return <></>;
  }

  /**
   * Get editor based on Property type.
   *
   * @private
   * @param {Property} p
   * @returns {JSX.Element}
   */
  private getPropertyEditor(p: Property): JSX.Element {
    const {
      group,
      groupProperties,
      filter,
      isExpanded,
      gridState,
      onExpandedChange,
      onPropertyExpandedChange,
      ...baseProps
    } = this.props;
    if (p.editorType === 'hidden') {
      return <div key={p.name}></div>;
    } else if (p.name === 'states') {
      return <StatesPropertyPanel key={p.name} property={p} {...baseProps} />;
    } else if (p.editorType.startsWith('ChartElementReference')) {
      return <ElementRefPanel key={p.name} property={p} {...baseProps} />;
    } else if (
      p.editorType !== 'List' &&
      p.editorType !== 'ListTemplate' &&
      p.editorType !== 'DictionaryTemplate' &&
      p.editorType !== 'Template'
    ) {
      return <SinglePropertyPanel key={p.name} property={p} {...baseProps} />;
    } else if (p.editorType === 'Template') {
      return <TemplatePropertyPanel key={p.name} property={p} {...baseProps} />;
    } else {
      return (
        <ListPropertyPanel
          key={p.name}
          property={p}
          isExpanded={this.props.gridState.propertyExpandedStates[p.name]}
          onExpandedChange={() => this.props.onPropertyExpandedChange(p.name)}
          {...baseProps}
        />
      );
    }
  }

  private get isFilterSet(): boolean {
    return this.props.filter !== undefined && this.props.filter !== '';
  }

  private isPropertyVisible(p: Property): boolean {
    if (p.editorType !== 'hidden') {
      if (!this.isFilterSet) {
        // no filter
        if (this.isExpanded || p.isCore || p.isSet || p.isUserSet) {
          return true;
        } else {
          return false;
        }
      } else {
        // filter by property name
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const criteria = new RegExp(this.props.filter!, 'gi');
        if (
          p.name.match(criteria) ||
          PropertyEditorHelpers.getDisplayName(
            p,
            this.props.editorState.language
          ).match(criteria)
        ) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  }
}

export default PropertyGroup;
