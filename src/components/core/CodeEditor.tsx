import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { column, stretch } from '../../utils/Prefixes';
import { StyleClass, css, StyleSelector } from '../../utils/Style';

import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/lucario.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';

const codeMirrorStyle = new StyleClass(
  column,
  stretch,
  css`
    width: 100%;
  `
);

new StyleSelector('.CodeMirror', stretch);

interface ICodeEditorProps {
  value: string;
  mode: 'javascript' | 'html';
  readOnly?: boolean;
  onValueChange?: (newValue: string) => void;
  onBlur?: () => void;
}

@observer
class CodeEditor extends Component<ICodeEditorProps> {
  public constructor(props: Readonly<ICodeEditorProps>) {
    super(props);

    this.handleCodeChanged = this.handleCodeChanged.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  public render() {
    return (
      <CodeMirror
        className={codeMirrorStyle.className}
        value={this.props.value}
        options={{
          mode:
            this.props.mode === 'javascript'
              ? { name: 'javascript', json: true }
              : { name: 'htmlmixed' },
          lineWrapping: true,
          readOnly: this.props.readOnly === true,
          theme: 'lucario',
          lineNumbers: true
        }}
        onBeforeChange={(editor, data, value) => {
          try {
            this.handleCodeChanged(value);
          } catch {
            data.cancel();
          }
        }}
        onBlur={() => this.handleBlur()}
      />
    );
  }

  private handleCodeChanged(newCode: string) {
    if (this.props.onValueChange) {
      this.props.onValueChange(newCode);
    }
  }
  private handleBlur() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }
}

export default CodeEditor;
