import React, { Component } from 'react';

import { StyleClass, css } from '../../utils/Style';

import { Spinner } from '@blueprintjs/core';

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

class SpinnerView extends Component {
  public render() {
    return (
      <div className={`${spinnerStyle.className}`}>
        <Spinner />
      </div>
    );
  }
}

export default SpinnerView;
