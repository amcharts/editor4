import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import CodeEditor from '../../core/CodeEditor';
import { Button, Callout } from '@blueprintjs/core';
import { StyleClass, css } from '../../../utils/Style';
import { Language } from '../../../utils/Language';

const codeImportStyle = new StyleClass(css`
  padding: 20px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
`);

const importButtoRowStyle = new StyleClass(css`
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`);

interface ICodeImportProps {
  lang: Language;
  onChartImport: (config: object) => void;
}

@observer
class CodeImport extends Component<ICodeImportProps> {
  @observable private codeToImport = '';
  @observable private importErrorMessage = '';

  public constructor(props: Readonly<ICodeImportProps>) {
    super(props);

    this.handleImportClick = this.handleImportClick.bind(this);
  }

  render() {
    const lang = this.props.lang;

    return (
      <div className={codeImportStyle.className}>
        <p>
          {lang.getUiTranslation(
            'code_import.prompt',
            'Paste JSON chart config or JavaScript code created with this Editor in the field below and press "Import."'
          )}
        </p>
        <CodeEditor
          mode="javascript"
          value={this.codeToImport}
          readOnly={false}
          onValueChange={newVale => (this.codeToImport = newVale)}
        />
        {this.importErrorMessage !== '' && (
          <Callout intent="danger" icon="error" title="Error importing">
            {this.importErrorMessage}
          </Callout>
        )}
        <div className={importButtoRowStyle.className}>
          <Button
            icon="import"
            text={lang.getUiTranslation(
              'code_import.import_button',
              'Import...'
            )}
            onClick={this.handleImportClick}
            disabled={this.codeToImport === ''}
          />
        </div>
      </div>
    );
  }

  private async handleImportClick() {
    // @todo: import from object-style code special tag
    this.importErrorMessage = '';
    if (this.codeToImport !== '') {
      let jsonConfig: object | undefined = undefined;
      try {
        jsonConfig = JSON.parse(this.codeToImport);
      } catch (error) {
        this.importErrorMessage = error.message;
      }
      if (jsonConfig !== undefined && this.props.onChartImport) {
        this.props.onChartImport(jsonConfig);
      }
    }
  }
}

export default CodeImport;
