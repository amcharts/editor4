import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Card, H4, H2, Tabs, Tab, Classes, TabId } from '@blueprintjs/core';

import { StyleClass, css, StyleSelector } from '../../../utils/Style';
import IBaseProps from '../../core/IBaseProps';
import ITemplate from '../../../classes/ITemplate';
import { observer } from 'mobx-react';
import ITemplateGroup from '../../../classes/ITemplateGroup';

import defaultPreviewImg from '../../../assets/default-template-cover.jpg';
import CodeImport from './CodeImport';
import { action } from 'mobx';
import EditorState from '../../core/EditorState';

const homeStyle = new StyleClass(css`
  padding: 20px;
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`);

const templateListStyle = new StyleClass(css`
  overflow: hidden;
  flex-grow: 2;
`);

const templateTabStyle = new StyleClass(css`
  overflow: hidden;
`);

new StyleSelector(
  `.${Classes.TAB_PANEL}.${templateTabStyle.className}`,
  css`
    flex-grow: 2;
    overflow: auto;
  `
);

const templateGroupStyle = new StyleClass(css`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`);

const templateGroupListStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
  flex-grow: 2;
  justify-content: flex-start;
  flex-wrap: wrap;
`);

const templateListItemStyle = new StyleClass(css`
  margin-right: 10px;
  margin-bottom: 10px;
  width: 350px;
  max-width: 350px;
`);

const templateHeadingStyle = new StyleClass(css`
  font-weight: normal;
`);

const templatePreviewImageStyle = new StyleClass(css`
  width: 300px;
  height: 200px;
  max-width: 300px;
  max-height: 200px;
  background-size: cover;
  background-position: center center;
`);

const mainHeadingStyle = new StyleClass(css`
  font-weight: 100;
`);

const codeTabStyle = new StyleClass(css`
  display: flex;
  overflow: hidden;
`);

new StyleSelector(
  `.${Classes.TAB_PANEL}.${codeTabStyle.className}`,
  css`
    flex-grow: 2;
  `
);

interface IHomeProps extends IBaseProps, RouteComponentProps {
  onChartImported: (config: object) => void;
}

@observer
class Home extends Component<IHomeProps> {
  private activeCard?: HTMLElement = undefined;
  private setActiveCardRef = (element: HTMLDivElement) => {
    this.activeCard = element;
  };

  public constructor(props: Readonly<IHomeProps>) {
    super(props);

    this.handleImport = this.handleImport.bind(this);
  }

  componentDidMount() {
    if (this.activeCard) {
      this.activeCard.scrollIntoView();
    }
  }

  public render() {
    if (
      this.props.editorState.editorConfig !== undefined &&
      this.props.editorState.editorConfig.templates !== undefined
    ) {
      const lang = this.props.editorState.language;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const TemplateCard = (props: {
        template: ITemplate;
        editorState: EditorState;
        handleClick: (config: object) => void;
        setActiveCardRef: (element: HTMLDivElement) => void;
      }): JSX.Element => {
        return (
          <Card
            interactive={true}
            className={templateListItemStyle.className}
            elevation={
              props.template.id === props.editorState.activeTemplate ? 3 : 0
            }
            onClick={() => {
              props.editorState.activeTemplate = props.template.id;
              props.handleClick(props.template.config);
            }}
          >
            <div
              className={templatePreviewImageStyle.className}
              style={{
                backgroundImage: `url(${
                  props.template.previewSrc !== undefined
                    ? props.template.previewSrc
                    : defaultPreviewImg
                })`
              }}
              ref={
                props.template.id === props.editorState.activeTemplate
                  ? props.setActiveCardRef
                  : undefined
              }
            >
              <span />
            </div>
            <H4 className={templateHeadingStyle.className}>
              {lang.getUiTranslation(
                `template_title.${props.template.id}`,
                props.template.displayName
              )}
            </H4>
            <p>{props.template.description}</p>
          </Card>
        );
      };

      const TemplateGroup = (props: {
        templateGroup: ITemplateGroup;
        editorState: EditorState;
        handleClick: (config: object) => void;
        setActiveCardRef: (element: HTMLDivElement) => void;
      }): JSX.Element => {
        return (
          <div className={templateGroupStyle.className}>
            <div className={templateGroupListStyle.className}>
              {props.templateGroup.templates.map(t => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  editorState={props.editorState}
                  handleClick={props.handleClick}
                  setActiveCardRef={props.setActiveCardRef}
                />
              ))}
            </div>
          </div>
        );
      };

      return (
        <div className={homeStyle.className}>
          <H2 className={mainHeadingStyle.className}>
            {lang.getUiTranslation(`home.new_chart_title`, 'New chart')}
          </H2>
          <p>
            {lang.getUiTranslation(
              `home.new_chart_description`,
              'Create a new chart based on one of the templates below or import a previously created chart.'
            )}
          </p>

          <Tabs
            className={templateListStyle.className}
            onChange={this.handleTabChange}
            vertical={true}
            selectedTabId={this.props.editorState.activeTemplateTabId}
          >
            {this.props.editorState.editorConfig.templates.map(tg => (
              <Tab
                id={tg.name}
                key={tg.name}
                title={lang.getUiTranslation(
                  `template_group.${tg.name}`,
                  tg.name
                )}
                className={templateTabStyle.className}
                panel={
                  <TemplateGroup
                    templateGroup={tg}
                    editorState={this.props.editorState}
                    handleClick={this.handleImport}
                    setActiveCardRef={this.setActiveCardRef}
                  />
                }
              />
            ))}
            <Tabs.Expander />
            <Tab
              id="importCode"
              title={lang.getUiTranslation(
                'home.import_from_code',
                'Import from code...'
              )}
              className={codeTabStyle.className}
              panel={
                <CodeImport lang={lang} onChartImport={this.handleImport} />
              }
            />
          </Tabs>
        </div>
      );
    }

    return <span />;
  }

  private async handleImport(config: object) {
    if (this.props.onChartImported) {
      await this.props.onChartImported(config);
      this.props.history.push('/design');
    }
  }

  @action.bound
  private handleTabChange(newTabId: TabId) {
    this.props.editorState.activeTemplateTabId = newTabId.toString();
  }
}

export default Home;
