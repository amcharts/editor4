import React, { Component } from 'react';

import { Button } from '@blueprintjs/core';

import { row, stretch } from '../../utils/Prefixes';
import { StyleClass, css } from '../../utils/Style';

import editorTheme from './../../themes/editor/EditorTheme';

import logo from './../../assets/amcharts_dark.svg';
import { Language } from '../../utils/Language';

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
  width: 86px;
  max-width: 86px;
`);

interface IHeaderProps {
  lang: Language;
  actionButtonsEnabled: boolean;
  showLogo: boolean;
  handleActionButtonClick: (isOK: boolean) => void;
}

class Header extends Component<IHeaderProps> {
  public render() {
    const lang = this.props.lang;
    return (
      <div className={`${headerStyle.className}`}>
        {this.props.showLogo && (
          <a
            href="https://amcharts.com"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              src={logo}
              alt="amCharts editor"
              className={logoStyle.className}
            />
          </a>
        )}
        <h2 className={headingStyle.className}>
          {lang.getUiTranslation('app.title', 'Chart Editor')}
        </h2>
        {this.props.actionButtonsEnabled && (
          <div className={editorTheme.uiLibThemeClassName}>
            <Button
              icon="tick"
              minimal={true}
              intent="success"
              text={lang.getUiTranslation('app.save_button', 'save')}
              onClick={() => this.props.handleActionButtonClick(true)}
            />
            <Button
              icon="cross"
              minimal={true}
              intent="danger"
              title={lang.getUiTranslation('app.close_button', 'close')}
              onClick={() => this.props.handleActionButtonClick(false)}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Header;
