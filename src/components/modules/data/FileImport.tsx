import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import {
  Button,
  Dialog,
  Classes,
  Intent,
  FileInput,
  Callout
} from '@blueprintjs/core';
import { StyleClass, css } from '../../../utils/Style';

const dialogStyle = new StyleClass(css`
  margin: 30px;
`);

const fileImportStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`);

interface IFileImportProps {
  isOpen: boolean;
  onFileImport: (fileContent: string) => void;
  onImportCancel: () => void;
}

@observer
class FileImport extends Component<IFileImportProps> {
  readonly importPromptText = 'Select file to import';
  @observable private loadingError = '';
  @observable private contentToImport = '';
  @observable private importFileName = this.importPromptText;

  public constructor(props: Readonly<IFileImportProps>) {
    super(props);
  }

  render() {
    return (
      <Dialog
        icon="import"
        isOpen={this.props.isOpen}
        onClose={this.props.onImportCancel}
        title="Import JSON data from file"
        className={dialogStyle.className}
      >
        <div className={`${Classes.DIALOG_BODY} ${fileImportStyle.className}`}>
          {this.loadingError !== undefined && this.loadingError.length > 0 && (
            <Callout title="Error importing file">{this.loadingError}</Callout>
          )}
          <p>Select a JSON data file and press "Import."</p>
          <FileInput
            text={this.importFileName}
            hasSelection={this.importFileName !== this.importPromptText}
            onInputChange={this.importJson}
          />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.props.onImportCancel}>Close</Button>
            <Button
              intent={Intent.PRIMARY}
              icon="import"
              onClick={this.handleImportClick}
            >
              Import...
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  @action.bound
  private handleImportClick() {
    if (this.contentToImport !== '') {
      this.props.onFileImport(this.contentToImport);
    }
  }

  // TODO move to a utility file
  @action.bound
  private readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onabort = () => {
        reject(new Error('File reading was aborted'));
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.readAsText(file);
    });
  }

  @action.bound
  setError(e: Error): void {
    this.loadingError = e.message;
  }

  @action.bound
  async importJson(event: React.FormEvent<HTMLInputElement>) {
    const files = (event.target as HTMLInputElement).files;

    if (files == null) {
      this.loadingError = 'Please select a file';
    } else if (files.length !== 1) {
      this.loadingError = 'Cannot import multiple files';
    } else {
      try {
        this.importFileName = files[0].name;
        this.contentToImport = await this.readFile(files[0]);
      } catch (error) {
        this.setError(error);
      }
    }
  }
}

export default FileImport;
