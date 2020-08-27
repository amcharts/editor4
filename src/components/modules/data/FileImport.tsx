import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import {
  Button,
  Dialog,
  Classes,
  Intent,
  FileInput,
  Callout,
  FormGroup,
  Checkbox,
  HTMLSelect,
  IOptionProps
} from '@blueprintjs/core';
import { StyleClass, css } from '../../../utils/Style';
import Papa, { ParseConfig } from 'papaparse';

const dialogStyle = new StyleClass(css`
  margin: 30px;
`);

const fileImportStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`);

const optionsBlockStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
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
  @observable private firstRowHeadings = true;
  @observable private delimiter = 'auto';
  @observable private fileToImport?: File;

  delimiterOptions: IOptionProps[] = [
    { value: 'auto' },
    { value: ',' },
    { value: ';' },
    { value: '\t', label: '(tab)' },
    { value: ' ', label: '(space)' }
  ];

  @computed
  private get isCSV(): boolean {
    if (this.importFileName !== this.importPromptText) {
      if (
        this.importFileName.lastIndexOf('.') > -1 &&
        this.importFileName.lastIndexOf('.') < this.importFileName.length - 1
      ) {
        const extension = this.importFileName
          .substring(this.importFileName.lastIndexOf('.') + 1)
          .toLowerCase();
        switch (extension) {
          case 'csv':
          case 'tsv':
          case 'txt':
            return true;
          default:
            return false;
        }
      }
    }
    return false;
  }

  public constructor(props: Readonly<IFileImportProps>) {
    super(props);
  }

  render() {
    return (
      <Dialog
        icon="import"
        isOpen={this.props.isOpen}
        onClose={this.props.onImportCancel}
        title="Import data from a file"
        className={dialogStyle.className}
      >
        <div className={`${Classes.DIALOG_BODY} ${fileImportStyle.className}`}>
          {this.loadingError !== undefined && this.loadingError.length > 0 && (
            <Callout title="Error importing file">{this.loadingError}</Callout>
          )}
          <p>Select a JSON or CSV data file and press "Import."</p>
          <FileInput
            text={this.importFileName}
            hasSelection={this.importFileName !== this.importPromptText}
            onInputChange={this.handleFileSelectionChanged}
          />
          {this.isCSV && (
            <div>
              <h5>CSV import options:</h5>
              <div className={optionsBlockStyle.className}>
                <FormGroup>
                  <Checkbox
                    checked={this.firstRowHeadings}
                    label="My data has headers"
                    onChange={() => {
                      this.firstRowHeadings = !this.firstRowHeadings;
                    }}
                  />
                </FormGroup>
                <FormGroup label="Delimiter:" inline={true}>
                  <HTMLSelect
                    options={this.delimiterOptions}
                    placeholder="Delimiter"
                    minimal={true}
                    value={this.delimiter}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                      this.delimiter = event.target.value;
                    }}
                  />
                </FormGroup>
              </div>
            </div>
          )}
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.props.onImportCancel}>Close</Button>
            <Button
              intent={Intent.PRIMARY}
              icon="import"
              disabled={this.fileToImport === undefined}
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
  private async handleImportClick() {
    if (this.isCSV) {
      this.importCsvFile();
    } else {
      await this.importJsonFile();
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
  handleFileSelectionChanged(event: React.FormEvent<HTMLInputElement>) {
    this.fileToImport = undefined;
    this.contentToImport = '';
    const files = (event.target as HTMLInputElement).files;

    if (files == null) {
      this.loadingError = 'Please select a file';
    } else if (files.length !== 1) {
      this.loadingError = 'Cannot import multiple files';
    } else {
      this.fileToImport = files[0];
      this.importFileName = this.fileToImport.name;
    }
  }

  @action.bound
  async importJsonFile() {
    if (this.fileToImport !== undefined) {
      try {
        this.contentToImport = await this.readFile(this.fileToImport);
        if (this.contentToImport !== '') {
          this.props.onFileImport(this.contentToImport);
        }
      } catch (error) {
        this.setError(error);
      }
    }
  }

  @action.bound
  importCsvFile() {
    const parseConfig: ParseConfig = {
      dynamicTyping: true,
      skipEmptyLines: 'greedy',
      complete: (result, file) => {
        this.contentToImport = JSON.stringify(result.data);
        if (this.contentToImport !== '') {
          this.props.onFileImport(this.contentToImport);
        }
      }
    };
    parseConfig.header = this.firstRowHeadings;
    if (this.firstRowHeadings) {
      parseConfig.transformHeader = (header): string => {
        // prefix number column names if any
        if (Number.parseInt(header).toString() === header) {
          return `c_${header}`;
        } else {
          return header;
        }
      };
    }
    if (this.delimiter !== 'auto') {
      parseConfig.delimiter = this.delimiter;
    }
    if (this.fileToImport !== undefined) {
      Papa.parse(this.fileToImport, parseConfig);
    }
  }
}

export default FileImport;
