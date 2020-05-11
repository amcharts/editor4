import React, { Component } from 'react';

import { StyleClass, css } from '../../utils/Style';

import { Spinner } from '@blueprintjs/core';
import IBaseProps from './IBaseProps';

const spinnerStyle = new StyleClass(css`
  margin: 0px;
  padding: 0px;
  height: 100%;
  height: 100vh;
  width: 100%;
  width: 100vw;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  position: absolute;
  z-index: 10000;
`);

const spinnerStyleHidden = new StyleClass(css`
  display: none;
`);

class SpinnerView extends Component<IBaseProps> {
  public render() {
    return (
      <div
        className={`${
          this.props.editorState.isBusy
            ? spinnerStyle.className
            : spinnerStyleHidden.className
        }`}
      >
        <Spinner />
      </div>
    );
  }
}

export default SpinnerView;
