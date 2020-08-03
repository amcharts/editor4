import React, { Component } from 'react';
import Property from '../../../classes/Property';
import IValueType from '../../../classes/IValueType';
import { Menu, MenuItem } from '@blueprintjs/core';

interface ITypeSelectionMenuProps {
  property: Property;
  onItemClick: (
    p: Property,
    itemType: IValueType,
    forTemplate?: boolean
  ) => void;
  forTemplate?: boolean;
}

class TypeSelectionMenu extends Component<ITypeSelectionMenuProps> {
  public constructor(props: Readonly<ITypeSelectionMenuProps>) {
    super(props);

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  public render() {
    return <Menu key="menu">{this.getNewListItemMenuItems()}</Menu>;
  }

  private handleItemClick(itemType: IValueType) {
    if (this.props.onItemClick) {
      this.props.onItemClick(
        this.props.property,
        itemType,
        this.props.forTemplate
      );
    }
  }

  private getNewListItemMenuItems(): JSX.Element[] | undefined {
    if (
      this.props.property.valueTypes &&
      this.props.property.valueTypes.length > 0
    ) {
      const valueTypes = this.props.property.valueTypes[0].subTypes
        ? this.props.property.valueTypes[0].subTypes
        : this.props.property.valueTypes;

      return valueTypes.map(vt => (
        <MenuItem
          key={vt.name}
          text={vt.name}
          onClick={() => this.handleItemClick(vt)}
        />
      ));
    }
  }
}

export default TypeSelectionMenu;
