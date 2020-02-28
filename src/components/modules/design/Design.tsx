import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { StyleClass, css } from '../../../utils/Style';

import IBaseProps from '../../core/IBaseProps';
import Preview from './Preview';
import PropertyPanel from './PropertyPanel';

const designModuleStyle = new StyleClass(css`
  flex-grow: 2;

  display: flex;
  flex-direction: row;

  overflow: hidden;
`);

const previewStyle = new StyleClass(css`
  flex-grow: 2;
  display: flex;
`);

@observer
class Design extends Component<IBaseProps> {
  public render() {
    return (
      <div className={designModuleStyle.className}>
        <div className={previewStyle.className}>
          <Preview editorState={this.props.editorState} />
        </div>
        <PropertyPanel {...this.props} />
      </div>
    );
  }
}

export default Design;
