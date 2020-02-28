import React, { Component } from 'react';

import { Button } from '@blueprintjs/core';

import { row, stretch } from '../../utils/Prefixes';
import { StyleClass, css } from '../../utils/Style';

import editorTheme from './../../themes/editor/EditorTheme';

import logo from './../../assets/amcharts_dark.svg';

const headerStyle = new StyleClass(
  row,
  css`
    background: ${editorTheme.headerBarBackground};
    color: ${editorTheme.headerTextColor};
    padding: 5px;
    padding-left: 20px;
  `
);

const headingStyle = new StyleClass(
  stretch,
  css`
    padding-left: 5px;
    font-weight: 100;
  `
);

const logoStyle = new StyleClass(css`
  max-width: 86px;
`);

interface IHeaderProps {
  actionButtonsEnabled: boolean;
  handleActionButtonClick: (isOK: boolean) => void;
}

class Header extends Component<IHeaderProps> {
  public render() {
    return (
      <div className={`${headerStyle.className}`}>
        <img src={logo} alt="amCharts editor" className={logoStyle.className} />
        <h2 className={headingStyle.className}>Chart Editor</h2>
        {this.props.actionButtonsEnabled && (
          <div className={editorTheme.uiLibThemeClassName}>
            <Button
              icon="tick"
              minimal={true}
              intent="success"
              text="save"
              onClick={() => this.props.handleActionButtonClick(true)}
            />
            <Button
              icon="cross"
              minimal={true}
              intent="danger"
              title="close"
              onClick={() => this.props.handleActionButtonClick(false)}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Header;
