import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { StyleClass, css, StyleSelector } from '../../../utils/Style';

import IBaseProps from '../../core/IBaseProps';
import { observable, computed } from 'mobx';
import PropertyConfigManager from '../../../classes/PropertyConfigManager';
import { RouteComponentProps } from 'react-router-dom';

import jsbeautifier from 'js-beautify';
import CodeEditor from '../../core/CodeEditor';
import { Tabs, Tab, Classes } from '@blueprintjs/core';

const codeModuleStyle = new StyleClass(css`
  display: flex;
  flex-grow: 2;
  padding: 10px;
`);
const codeTabsStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  overflow: hidden;
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

interface ICodeProps extends IBaseProps, RouteComponentProps {
  onConfigChanged: (config: object) => void;
}

@observer
class Code extends Component<ICodeProps> {
  @observable private jsonConfig: object = {};
  @observable private jsonConfigString = '';
  @observable private isDirty = false;

  @computed private get beautifiedJsonConfig(): string {
    return jsbeautifier.js_beautify(JSON.stringify(this.jsonConfig));
  }

  @computed private get beautifiedJsonConfigString(): string {
    return jsbeautifier.js_beautify(this.jsonConfigString);
  }

  @computed private get importsAndCore(): string {
    let result = `import * as am4core from '@amcharts/amcharts4/core';
import '@amcharts/amcharts4/charts';
import '@amcharts/amcharts4/maps';

`;

    let useThemes = '';
    let addLicenses = '';

    if (
      this.props.editorState.licenseNumbers &&
      this.props.editorState.licenseNumbers.length > 0
    ) {
      this.props.editorState.licenseNumbers.forEach(license => {
        addLicenses += `am4core.addLicense("${license}");\n`;
      });
      addLicenses += `\n`;
    }

    if (
      this.props.editorState.appliedThemes &&
      this.props.editorState.appliedThemes.length > 0
    ) {
      this.props.editorState.appliedThemes.forEach(theme => {
        const themeName = theme.startsWith('am4themes_')
          ? theme.substr(10)
          : theme;
        result += `import am4themes_${themeName} from '@amcharts/amcharts4/themes/${themeName}';\n`;
        useThemes += `am4core.useTheme(am4themes_${themeName});\n`;
      });
      result += `\n`;
      useThemes += `\n`;
    }

    result += `${addLicenses}${useThemes}`;

    return result;
  }

  @computed private get es2015WithJson(): string {
    let result = this.importsAndCore;
    result += `let chart = am4core.createFromConfig(
      ${JSON.stringify(this.jsonConfig)},
      document.getElementById('chartdiv')
    );`;

    return jsbeautifier.js_beautify(result);
  }

  @computed private get htmlJsConfig(): string {
    let result = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>amCharts 4</title>
  
  <script src="//www.amcharts.com/lib/4/core.js"></script>
  <script src="//www.amcharts.com/lib/4/charts.js"></script>
  <script src="//www.amcharts.com/lib/4/maps.js"></script>

`;

    let useThemes = '';
    let addLicenses = '';

    if (
      this.props.editorState.licenseNumbers &&
      this.props.editorState.licenseNumbers.length > 0
    ) {
      this.props.editorState.licenseNumbers.forEach(license => {
        addLicenses += `am4core.addLicense("${license}");\n`;
      });
      addLicenses += `\n`;
    }

    if (
      this.props.editorState.appliedThemes &&
      this.props.editorState.appliedThemes.length > 0
    ) {
      this.props.editorState.appliedThemes.forEach(theme => {
        const themeName = theme.startsWith('am4themes_')
          ? theme.substr(10)
          : theme;
        result += `  <script src="//www.amcharts.com/lib/4/themes/${themeName}.js"></script>\n`;
        useThemes += `am4core.useTheme(am4themes_${themeName});\n`;
      });
      result += '\n';
      useThemes += `\n`;
    }

    result += `  <script>\n`;
    let jsResult = `am4core.ready(function() {\n${addLicenses}${useThemes}`;

    jsResult += `let chart = am4core.createFromConfig(
      ${JSON.stringify(this.jsonConfig)},
      document.getElementById('chartdiv')
    );\n`;

    jsResult += `});`;

    /* eslint-disable @typescript-eslint/camelcase */
    result += jsbeautifier.js_beautify(jsResult, { indent_level: 1 });
    /* eslint-enable @typescript-eslint/camelcase */

    result += `
  </script>
</head>
<body>
  <div id="chartdiv" style="width:100%; height:500px;"></div>
</body>
</html>`;

    return result;
  }

  @computed private get jsCode(): string {
    // return this.generateJsFromJsonCofing(this.jsonConfig);
    let result = this.importsAndCore;
    if (this.props.editorState.chartProperties) {
      result += jsbeautifier.js_beautify(
        PropertyConfigManager.propertyToJs(
          this.props.editorState.chartProperties,
          this.props.editorState.chartData,
          'chart'
        )
      );
    }
    const encodedJson = window.btoa(JSON.stringify(this.jsonConfig));
    let encodedJsonSplit = '';
    for (let index = 0; index < encodedJson.length; index += 80) {
      encodedJsonSplit += `* ${encodedJson.substr(index, 80)}`;
      if (index + 80 < encodedJson.length) {
        encodedJsonSplit += `\n`;
      }
    }
    result += `\n\n/******************************
* IMPORTANT: keep this part if you want to be able to edit this chart in the Editor.
* Note: the changes you make to the chart code below will not be reflect in the Editor.
* 
* @chartConfig 
${encodedJsonSplit}
* /@chartConfig
******************************/\n`;
    return result;
  }

  public constructor(props: Readonly<ICodeProps>) {
    super(props);

    this.handleCodeChanged = this.handleCodeChanged.bind(this);
    this.handleEditorBlur = this.handleEditorBlur.bind(this);
    // this.generateJsFromJsonCofing = this.generateJsFromJsonCofing.bind(this);
  }

  public componentDidMount() {
    if (this.props.editorState.chartProperties !== undefined) {
      this.jsonConfig = PropertyConfigManager.propertyToConfig(
        this.props.editorState.chartProperties,
        this.props.editorState.chartData
      );
      this.jsonConfigString = JSON.stringify(this.jsonConfig);
    }
  }

  public render() {
    const lang = this.props.editorState.language;
    return (
      <div className={codeModuleStyle.className}>
        <Tabs
          className={codeTabsStyle.className}
          renderActiveTabPanelOnly={true}
        >
          <Tab
            id="jsonConfig"
            title={lang.getUiTranslation('code.json_tab', 'JSON config')}
            className={codeTabStyle.className}
            panel={
              <CodeEditor
                value={this.beautifiedJsonConfigString}
                mode="javascript"
                onValueChange={newValue => {
                  this.handleCodeChanged(newValue);
                }}
                onBlur={this.handleEditorBlur}
              />
            }
          />
          <Tab
            id="es2015JsonConfig"
            title={lang.getUiTranslation(
              'code.es2015_tab',
              'ES2015/TypeScript with JSON'
            )}
            className={codeTabStyle.className}
            panel={
              <CodeEditor
                value={this.es2015WithJson}
                mode="javascript"
                readOnly={true}
              />
            }
          />
          <Tab
            id="htmlJs"
            title={lang.getUiTranslation(
              'code.html_js_tab',
              'HTML &amp; JavaScript'
            )}
            className={codeTabStyle.className}
            panel={
              <CodeEditor
                value={this.htmlJsConfig}
                mode="html"
                readOnly={true}
              />
            }
          />
          <Tab
            id="jsCode"
            title={lang.getUiTranslation(
              'code.object_js_tab',
              'Object-style ES2015'
            )}
            className={codeTabStyle.className}
            panel={
              <CodeEditor
                value={this.jsCode}
                mode="javascript"
                readOnly={true}
              />
            }
          />
        </Tabs>
      </div>
    );
  }

  private handleCodeChanged(newCode: string) {
    if (this.jsonConfigString !== newCode) {
      this.jsonConfigString = newCode;
      this.isDirty = true;
    }
  }
  private handleEditorBlur() {
    if (this.isDirty && this.props.onConfigChanged) {
      try {
        this.jsonConfig = JSON.parse(this.jsonConfigString);
        this.props.onConfigChanged(this.jsonConfig);
      } catch {
        // eslint-disable-next-line no-empty
      }
    }
  }

  // private generateJsFromJsonCofing(
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   config: any,
  //   varName?: string,
  //   module?: 'am4charts' | 'am4maps'
  // ): string {
  //   const localVarName = varName !== undefined ? varName : 'chart';
  //   const localModule: 'am4charts' | 'am4maps' =
  //     module === undefined
  //       ? config.type === 'MapChart'
  //         ? 'am4maps'
  //         : 'am4charts'
  //       : module;
  //   let result = '';

  //   if (localVarName === 'chart') {
  //     // top level
  //     result = `let chart = am4core.create("chartdiv", ${localModule}.${config.type});\n\n`;
  //   }

  //   Object.keys(config).forEach((key, index) => {
  //     if (key !== 'type') {
  //       if (key === 'data') {
  //         // just output data as json
  //         result += `${localVarName}.data = ${JSON.stringify(
  //           Object.values(config)[index]
  //         )};\n\n`;
  //       } else if (Array.isArray(Object.values(config)[index])) {
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         (Object.values(config)[index] as Array<any>).forEach((el, i) => {
  //           const namePrefix =
  //             localVarName === 'chart' ? '' : localVarName.replace('.', '');
  //           let elName = namePrefix + key;
  //           let levelPath = `.${key}`;
  //           if (elName === 'values') {
  //             elName =
  //               namePrefix +
  //               localVarName.substr(localVarName.lastIndexOf('.') + 1);
  //             levelPath = '';
  //           }
  //           elName += `${i + 1}`;
  //           if (el.type !== undefined) {
  //             result += `let ${elName} = ${localVarName}${levelPath}.push(new ${localModule}.${el.type}());\n`;
  //           } else {
  //             result += `let ${elName} = ${localVarName}${levelPath}.create();\n`;
  //           }
  //           result += this.generateJsFromJsonCofing(el, elName, localModule);
  //         });
  //       } else if (typeof Object.values(config)[index] === 'object') {
  //         const levelConfig = Object.values(config)[index] as object;
  //         result += this.generateJsFromJsonCofing(
  //           levelConfig,
  //           `${localVarName}.${key}`,
  //           localModule
  //         );
  //         result += `\n`;
  //       } else {
  //         const quoteOrNot =
  //           typeof Object.values(config)[index] === 'string' ? '"' : '';
  //         result += `${localVarName}.${key} = ${quoteOrNot}${
  //           Object.values(config)[index]
  //         }${quoteOrNot};\n`;
  //       }
  //     }
  //   });

  //   return result;
  // }
}

export default Code;
