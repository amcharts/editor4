import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputGroup } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';

/**
 * Defines if editor is pure number editor or it can also contain percent values.
 *
 * @interface IPropertyEditorNumberProps
 * @extends {IPropertyEditorProps}
 */
interface IPropertyEditorNumberProps extends IPropertyEditorProps {
  acceptPercent?: boolean;
}

@observer
class NumberEditor extends Component<IPropertyEditorNumberProps> {
  public render() {
    const p = this.props.property;
    return (
      <InputGroup
        small={true}
        value={p.value !== undefined ? p.value : ''}
        type={this.props.acceptPercent ? 'string' : 'number'}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (this.props.onPropertyValueChange) {
            this.props.onPropertyValueChange(p, {
              newValue: event.target.value
            });
          }
        }}
      />
    );
  }
}

export default NumberEditor;
