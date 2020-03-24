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
import * as am4core from '@amcharts/amcharts4/core';

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
    { value: 'auto' },
    { value: ',' },
    { value: ';' },
    { value: '\t', label: '(tab)' },
    { value: ' ', label: '(space)' }
  ];

  public constructor(props: Readonly<ICsvImportProps>) {
    super(props);
  }

  render() {
    return (
      <Dialog
        icon="import"
        isOpen={this.props.isOpen}
        onClose={this.props.onImportCancel}
        title="Import CSV data"
        className={dialogStyle.className}
      >
        <div className={`${Classes.DIALOG_BODY} ${csvImportStyle.className}`}>
          <p>Paste CSV data into the field below and press "Import."</p>
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
    if (this.csvToImport !== '') {
      const trimmedCsv = this.csvToImport.trim();
      const parser = new am4core.CSVParser();
      parser.options.useColumnNames = this.firstRowHeadings;
      if (this.delimiter !== 'auto') {
        parser.options.delimiter = this.delimiter;
      }

      const parsedData = parser.parse(trimmedCsv);
      if (this.props.onCsvImport) {
        this.props.onCsvImport(parsedData);
      }
    }
  }
}

export default CsvImport;
