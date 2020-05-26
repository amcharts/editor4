import React, { Component } from 'react';

import { StyleClass, css } from '../../../utils/Style';

const loaderStyle = new StyleClass(css`
  background-color: #fff;
  position: absolute;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
`);

class Loader extends Component {
  public render() {
    return <div className={loaderStyle.className}>Loading...</div>;
  }
}

export default Loader;
