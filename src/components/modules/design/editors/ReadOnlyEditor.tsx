import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { InputGroup } from '@blueprintjs/core';
import IPropertyEditorProps from '../IPropertyEditorProps';

@observer
class ReadOnlyEditor extends Component<IPropertyEditorProps> {
  public render() {
    const p = this.props.property;
    return <InputGroup small={true} value={p.value} readOnly={true} />;
  }
}

export default ReadOnlyEditor;
