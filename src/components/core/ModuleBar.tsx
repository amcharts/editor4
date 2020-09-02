import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { Button, ButtonGroup } from '@blueprintjs/core';

import { StyleClass, css } from '../../utils/Style';

import editorTheme from './../../themes/editor/EditorTheme';
import IBaseProps from './IBaseProps';
import { ModuleType } from '../../classes/IConfig';

const moduleBarStyle = new StyleClass(css`
  background-color: ${editorTheme.moduleBarBackground};
`);

interface IMainMenuItem {
  title: string;
  type: ModuleType;
  icon: 'home' | 'style' | 'th' | 'code' | 'share';
  path: string;
}

const mainMenuItems: IMainMenuItem[] = [
  {
    title: 'Home',
    type: 'home',
    icon: 'home',
    path: '/home'
  },
  {
    title: 'Design',
    type: 'design',
    icon: 'style',
    path: '/design'
  },
  {
    title: 'Data',
    type: 'data',
    icon: 'th',
    path: '/data'
  },
  {
    title: 'Code',
    type: 'code',
    icon: 'code',
    path: '/code'
  }
  // {
  //   title: 'Share',
  //   type: 'share',
  //   icon: 'share',
  //   path: '/share'
  // }
];

@observer
class ModuleBar extends Component<IBaseProps & RouteComponentProps> {
  @observable private isExpanded = false;

  public constructor(props: Readonly<IBaseProps & RouteComponentProps>) {
    super(props);

    this.handleMenuButtonClick = this.handleMenuButtonClick.bind(this);
    this.handleMenuExpanderClick = this.handleMenuExpanderClick.bind(this);
  }

  public render() {
    const lang = this.props.editorState.language;

    const noModuleConfig =
      this.props.editorState.editorConfig === undefined ||
      this.props.editorState.editorConfig.enabledModules === undefined;

    const menuButtons = mainMenuItems
      .map(item => {
        if (
          noModuleConfig ||
          (this.props.editorState.editorConfig !== undefined &&
            this.props.editorState.editorConfig.enabledModules !== undefined &&
            this.props.editorState.editorConfig.enabledModules.indexOf(
              item.type
            ) >= 0)
        ) {
          return (
            <Button
              key={item.path}
              icon={item.icon}
              title={lang.getUiTranslation(
                `module_bar.${item.type}`,
                item.title
              )}
              text={
                this.isExpanded &&
                lang.getUiTranslation(`module_bar.${item.type}`, item.title)
              }
              intent={
                this.props.location.pathname === item.path ? 'primary' : 'none'
              }
              /*disabled={
                item.path !== '/' && this.props.chartProperties === undefined
              }*/
              onClick={() => this.handleMenuButtonClick(item.path)}
            />
          );
        }

        return undefined;
      })
      .filter(btn => btn !== undefined);

    return (
      menuButtons &&
      menuButtons.length !== 1 && (
        <div
          className={`${moduleBarStyle.className} ${editorTheme.uiLibThemeClassName}`}
        >
          <Button
            icon="menu"
            large={true}
            minimal={true}
            alignText="left"
            onClick={this.handleMenuExpanderClick}
          />

          <div>
            <ButtonGroup
              large={true}
              minimal={true}
              fill={false}
              alignText="left"
              vertical={true}
            >
              {menuButtons}
            </ButtonGroup>
          </div>
        </div>
      )
    );
  }

  private handleMenuExpanderClick() {
    this.isExpanded = !this.isExpanded;
  }

  private handleMenuButtonClick(path: string) {
    this.props.history.push(path);
  }
}

export default withRouter(ModuleBar);
