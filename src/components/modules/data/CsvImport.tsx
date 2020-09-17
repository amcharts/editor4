import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import {
  Button,
  Dialog,
  TextArea,
  Classes,
  Intent,
  Checkbox,
  IOptionProps,
  HTMLSelect,
  FormGroup
} from '@blueprintjs/core';
import { StyleClass, css } from '../../../utils/Style';
import Papa, { ParseConfig } from 'papaparse';
import { Language } from '../../../utils/Language';

const dialogStyle = new StyleClass(css`
  flex-grow: 2;
  align-self: stretch;
  margin: 30px;
`);

const csvImportStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`);

const optionsBlockStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`);

const textAreaStyle = new StyleClass(css`
  flex-grow: 2;
`);

interface ICsvImportProps {
  lang: Language;
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCsvImport: (data: any[]) => void;
  onImportCancel: () => void;
}

@observer
class CsvImport extends Component<ICsvImportProps> {
  @observable private csvToImport = '';
  @observable private firstRowHeadings = true;
  @observable private delimiter = 'auto';

  delimiterOptions: IOptionProps[] = [
    {
      value: 'auto',
      label: this.props.lang.getUiTranslation('csv_delimiter.auto', 'auto')
    },
    { value: ',' },
    { value: ';' },
    {
      value: '\t',
      label: this.props.lang.getUiTranslation('csv_delimiter.tab', '(tab)')
    },
    {
      value: ' ',
      label: this.props.lang.getUiTranslation('csv_delimiter.space', '(space)')
    }
  ];

  public constructor(props: Readonly<ICsvImportProps>) {
    super(props);
  }

  render() {
    const lang = this.props.lang;
    return (
      <Dialog
        icon="import"
        isOpen={this.props.isOpen}
        onClose={this.props.onImportCancel}
        title={lang.getUiTranslation('csv_import.title', 'Import CSV data')}
        className={dialogStyle.className}
      >
        <div className={`${Classes.DIALOG_BODY} ${csvImportStyle.className}`}>
          <p>
            {lang.getUiTranslation(
              'csv_import.prompt',
              'Paste CSV data into the field below and press "Import."'
            )}
          </p>
          <TextArea
            value={this.csvToImport}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              this.csvToImport = event.target.value;
            }}
            className={textAreaStyle.className}
          ></TextArea>
          <div className={optionsBlockStyle.className}>
            <FormGroup>
              <Checkbox
                checked={this.firstRowHeadings}
                label={lang.getUiTranslation(
                  'csv_import.csv_data_has_headers',
                  'My data has headers'
                )}
                onChange={() => {
                  this.firstRowHeadings = !this.firstRowHeadings;
                }}
              />
            </FormGroup>
            <FormGroup
              label={lang.getUiTranslation(
                'csv_import.csv_delimiter',
                'Delimiter:'
              )}
              inline={true}
            >
              <HTMLSelect
                options={this.delimiterOptions}
                placeholder={lang.getUiTranslation(
                  'csv_import.csv_delimiter',
                  'Delimiter:'
                )}
                minimal={true}
                value={this.delimiter}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  this.delimiter = event.target.value;
                }}
              />
            </FormGroup>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.props.onImportCancel}>
              {lang.getUiTranslation('csv_import.close_button', 'Close')}
            </Button>
            <Button
              intent={Intent.PRIMARY}
              icon="import"
              onClick={this.handleImportClick}
            >
              {lang.getUiTranslation('csv_import.import_button', 'Import...')}
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  @action.bound
  private handleImportClick() {
    if (this.csvToImport !== '') {
      const trimmedCsv = this.csvToImport.trim();

      const parseConfig: ParseConfig = {
        dynamicTyping: true
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

      const parsedData = Papa.parse(trimmedCsv, parseConfig);
      if (this.props.onCsvImport) {
        this.props.onCsvImport(parsedData.data);
      }
    }
  }
}

export default CsvImport;
