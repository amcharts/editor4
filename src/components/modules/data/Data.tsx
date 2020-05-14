import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { stretch } from '../../../utils/Prefixes';
import { StyleClass, css, StyleSelector } from '../../../utils/Style';

import editorTheme from './../../../themes/editor/EditorTheme';
import IBaseProps from '../../core/IBaseProps';
import { IChartData } from '../../core/IChartData';
import EditorState from '../../core/EditorState';
import { observable, computed, action, keys } from 'mobx';
import { RouteComponentProps } from 'react-router-dom';

import { Button, Tabs, Tab, Classes, ButtonGroup } from '@blueprintjs/core';
import { Menu, MenuItem, Navbar, Alignment } from '@blueprintjs/core';
import {
  Column,
  Table,
  EditableCell,
  EditableName,
  ColumnHeaderCell
} from '@blueprintjs/table';
import CodeEditor from '../../core/CodeEditor';
import jsbeautifier from 'js-beautify';
import CsvImport from './CsvImport';
import PropertyConfigManager from '../../../classes/PropertyConfigManager';
import FileImport from './FileImport';

type Ordering = -1 | 0 | 1;

function compare<A>(left: A, right: A): Ordering {
  if (left === right) {
    return 0;
  } else if (left < right) {
    return -1;
  } else {
    return 1;
  }
}

function compareKey<Key extends keyof IChartData>(
  left: IChartData,
  right: IChartData,
  key: Key,
  f: (left: IChartData[Key], right: IChartData[Key]) => Ordering
): Ordering {
  if (left[key] == null) {
    if (right[key] == null) {
      return 0;
    } else {
      return 1;
    }
  } else if (right[key] == null) {
    return -1;
  } else {
    return f(left[key], right[key]);
  }
}

function reverseOrder(order: Ordering): Ordering {
  if (order === -1) {
    return 1;
  } else if (order === 1) {
    return -1;
  } else {
    return order;
  }
}

interface IHeaderProps {
  columns: Array<string>;
  oldName: string;
  editorState: EditorState;
}

@observer
class ColumnHeader extends Component<IHeaderProps> {
  @observable currentName = this.props.oldName;

  @action.bound
  renameColumn(oldName: string, newName: string): void {
    if (oldName !== newName) {
      if (this.props.editorState.chartData) {
        if (newName === '') {
          // TODO replace with dialog box
          if (!window.confirm('Column cannot be empty, delete column?')) {
            this.currentName = this.props.oldName;
            return;
          }

          this.props.editorState.chartData.forEach(x => {
            delete x[oldName];
          });
        } else {
          if (this.props.columns.indexOf(newName) !== -1) {
            // TODO replace with dialog box
            if (!window.confirm('Column already exists, merge columns?')) {
              this.currentName = this.props.oldName;
              return;
            }
          }

          this.props.editorState.chartData.forEach(x => {
            if (oldName in x) {
              x[newName] = x[oldName];
              delete x[oldName];
            }
          });
        }
      }
    }
  }

  public render() {
    return (
      <EditableName
        name={this.currentName}
        key={this.props.oldName}
        onChange={(newName: string) => {
          this.currentName = newName;
        }}
        onCancel={(_name: string) => {
          this.currentName = this.props.oldName;
        }}
        onConfirm={(newName: string) => {
          this.renameColumn(this.props.oldName, newName);
        }}
      />
    );
  }
}

const dataStyle = new StyleClass(css`
  display: flex;
  flex-grow: 2;
  padding: 10px;
`);

const dataTabsStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  overflow: hidden;
`);

const dataTabStyle = new StyleClass(css`
  display: flex;
  overflow: hidden;
`);

new StyleSelector(
  `.${Classes.TAB_PANEL}.${dataTabStyle.className}`,
  css`
    flex-grow: 2;
  `
);

const dataPanelStyle = new StyleClass(css``);

const toolbarStyle = new StyleClass(css`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`);

// const toolbarButtonStyle = new StyleClass(css`
//   margin-left: 10px;
// `);

const dataModuleStyle = new StyleClass(
  stretch,
  css`
    overflow: auto;
    margin-left: 5px;
  `
);

interface IDataProps extends IBaseProps, RouteComponentProps {}

@observer
class Data extends Component<IDataProps> {
  @observable loadingError: string | null = null;
  @observable jsonDataString = '';
  @observable importCsvOpen = false;
  @observable importFileOpen = false;

  @computed get isFlat(): boolean {
    let result = true;

    const chartData = this.props.editorState.chartData;
    if (chartData && chartData.length > 0) {
      // flat if none of the items in data have array children
      result =
        chartData.find(dataItem => {
          return (
            undefined !==
            Object.keys(dataItem).find(itemPropKey =>
              Array.isArray(dataItem[itemPropKey])
            )
          );
        }) === undefined;
    }

    return result;
  }

  @computed get columns(): Array<string> {
    const columns: Array<string> = [];

    const chartData = this.props.editorState.chartData;

    if (chartData && chartData.length > 0) {
      // TODO make this faster
      keys(chartData[0]).forEach(key => {
        if (typeof key === 'string') {
          // TODO use Set ?
          if (columns.indexOf(key) === -1) {
            columns.push(key);
          }
        }
      });

      // TODO make utility function for this
      columns.sort((x, y) => {
        if (x === y) {
          return 0;
        } else if (x < y) {
          return -1;
        } else {
          return 1;
        }
      });
    }

    return columns;
  }

  @computed get newColumnName(): string {
    let columnNameIndex = this.columns.length;
    let name = `column-${columnNameIndex}`;

    while (this.columns.indexOf(name) > -1) {
      columnNameIndex++;
      name = `column-${columnNameIndex}`;
    }

    return name;
  }

  @computed private get beautifiedJsonData(): string {
    return jsbeautifier.js_beautify(this.jsonDataString);
  }

  public componentDidMount() {
    this.setJsonDataString();
  }

  @action.bound
  setJsonDataString() {
    this.jsonDataString = JSON.stringify(this.props.editorState.chartData);
  }

  // @action.bound
  // setNewColumnName(event: React.ChangeEvent<HTMLInputElement>): void {
  //   this.newColumnName = event.target.value;
  // }

  @action.bound
  addRow(): void {
    if (!this.props.editorState.chartData) {
      this.props.editorState.chartData = [];
    }

    const obj: IChartData = {};

    this.columns.forEach(column => {
      obj[column] = undefined;
    });

    this.props.editorState.chartData.push(obj);
    this.setJsonDataString();
  }

  // @action.bound
  // newColumnKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
  //   if (event.key === 'Enter') {
  //     this.addColumn();
  //   }
  // }

  @action.bound
  addColumn(): void {
    const name = this.newColumnName.trim();

    if (name !== '' && this.columns.indexOf(name) === -1) {
      // this.newColumnName = '';

      if (!this.props.editorState.chartData) {
        this.props.editorState.chartData = [];
      }

      if (this.props.editorState.chartData.length === 0) {
        this.props.editorState.chartData.push({});
      }

      this.props.editorState.chartData[0][name] = undefined;
      this.setJsonDataString();
    }
  }

  @action.bound
  setData(json: string): void {
    try {
      const data = JSON.parse(json);

      if (Array.isArray(data)) {
        this.loadingError = null;

        PropertyConfigManager.sanitizeData(data);

        const columns: Array<string> = [];

        data.forEach(x => {
          Object.keys(x).forEach(key => {
            // TODO use Set ?
            if (columns.indexOf(key) === -1) {
              columns.push(key);
            }
          });
        });

        data.forEach(x => {
          columns.forEach(key => {
            if (!(key in x)) {
              x[key] = undefined;
            }
          });
        });

        this.props.editorState.chartData = data;
        this.setJsonDataString();
      } else {
        this.loadingError = 'JSON data must be an array';
      }
    } catch {
      this.loadingError = 'Malformed JSON';
      // throw new SyntaxError('Malformed JSON');
    }
  }

  @action.bound
  setError(e: Error): void {
    this.loadingError = e.message;
  }

  // @action.bound
  // importJson(event: React.FormEvent<HTMLInputElement>): void {
  //   const files = (event.target as HTMLInputElement).files;

  //   if (files == null) {
  //     this.loadingError = 'Cannot import nothing';
  //   } else if (files.length !== 1) {
  //     this.loadingError = 'Cannot import multiple files';
  //   } else {
  //     readFile(files[0])
  //       .then(this.setData)
  //       .catch(this.setError);
  //   }
  // }

  @action.bound
  importCsv(event: React.FormEvent<HTMLElement>): void {
    this.importCsvOpen = true;
  }

  @action.bound
  importFile(event: React.FormEvent<HTMLElement>): void {
    this.importFileOpen = true;
  }

  @action.bound
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCsvImport(data: any[]): void {
    if (data.length > 0) {
      this.setData(JSON.stringify(data));
    }
    this.importCsvOpen = false;
  }

  @action.bound
  handleFileImport(data: string) {
    if (data.length > 0) {
      this.setData(data);
    }
    this.importFileOpen = false;
  }

  @action.bound
  changeCell(object: IChartData, name: string, value: string): void {
    const match = /^ *"([0-9]+(?:\.[0-9]+)?)" *$/.exec(value);

    if (match) {
      object[name] = match[1];
    } else {
      const number = +value;

      if (!Number.isNaN(number)) {
        object[name] = number;
      } else {
        object[name] = value;
      }
    }
    this.setJsonDataString();
  }

  renderCell = (index: number, column: number) => {
    const name = this.columns[column];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const object = this.props.editorState.chartData![index];

    let value = object[name];

    if (typeof value === 'string' && /^[0-9]+(?:\.[0-9]+)?$/.test(value)) {
      value = '"' + value + '"';
    }

    return (
      <EditableCell
        value={value || ''}
        onConfirm={value => this.changeCell(object, name, value)}
      />
    );
  };

  @action.bound
  sortByColumn(f: (left: IChartData, right: IChartData) => Ordering): void {
    if (this.props.editorState.chartData) {
      this.props.editorState.chartData = this.props.editorState.chartData
        .slice()
        .sort(f);
      this.setJsonDataString();
    }
  }

  renderColumnHeader = (column: number) => {
    const oldName = this.columns[column];

    return (
      <ColumnHeaderCell
        name={oldName}
        key={oldName}
        nameRenderer={(oldName: string) => {
          return (
            <ColumnHeader
              oldName={oldName}
              columns={this.columns}
              editorState={this.props.editorState}
            />
          );
        }}
        menuRenderer={(_columnIndex?: number) => {
          return (
            <Menu>
              <MenuItem
                icon="sort-asc"
                text="Sort Asc"
                onClick={() => {
                  this.sortByColumn((left, right) => {
                    return compareKey(left, right, oldName, compare);
                  });
                }}
              />
              <MenuItem
                icon="sort-desc"
                text="Sort Desc"
                onClick={() => {
                  this.sortByColumn((left, right) => {
                    return compareKey(left, right, oldName, (x, y) =>
                      reverseOrder(compare(x, y))
                    );
                  });
                }}
              />
            </Menu>
          );
        }}
      />
    );
  };

  @action.bound
  handleRowsReordered(
    oldIndex: number,
    newIndex: number,
    length: number
  ): void {
    if (oldIndex === newIndex) {
      return;
    }

    if (this.props.editorState.chartData) {
      const oldData = this.props.editorState.chartData[oldIndex];
      this.props.editorState.chartData.splice(oldIndex, 1);
      this.props.editorState.chartData.splice(newIndex, 0, oldData);
      this.setJsonDataString();
    }
  }

  @action.bound
  private handleCodeChanged(newCode: string) {
    this.jsonDataString = newCode;
  }

  @action.bound
  private handleEditorBlur() {
    this.setData(this.jsonDataString);
  }

  public render() {
    return (
      <div className={dataStyle.className}>
        <Tabs
          large={true}
          defaultSelectedTabId={this.isFlat ? 'table1' : 'json'}
          className={dataTabsStyle.className}
          renderActiveTabPanelOnly={true}
        >
          {this.isFlat && (
            <Tab
              id="table1"
              title="Table"
              className="dataTabStyle"
              panel={
                <div className={dataPanelStyle.className}>
                  <Navbar
                    className={`${toolbarStyle.className} ${editorTheme.uiLibThemeClassName}`}
                  >
                    <Navbar.Group align={Alignment.LEFT}>
                      <ButtonGroup minimal={true} large={true}>
                        <Button
                          rightIcon="add-column-left"
                          text="Add"
                          title="Add column"
                          onClick={this.addColumn}
                        />
                        <Button
                          icon="add-row-bottom"
                          title="Add row"
                          onClick={this.addRow}
                        />
                      </ButtonGroup>
                      <ButtonGroup minimal={true} large={true}>
                        <Button
                          rightIcon="remove-column-left"
                          text="Remove"
                          title="Remove column(s)"
                          disabled={true}
                        />
                        <Button
                          icon="remove-row-bottom"
                          title="Remove row(s)"
                          disabled={true}
                        />
                      </ButtonGroup>
                    </Navbar.Group>
                    <Navbar.Divider />
                    <Navbar.Group align={Alignment.LEFT}>
                      <Button
                        icon="import"
                        text="Import JSON"
                        minimal={true}
                        onClick={this.importFile}
                      />

                      <FileImport
                        isOpen={this.importFileOpen}
                        onFileImport={this.handleFileImport}
                        onImportCancel={() => {
                          this.importFileOpen = false;
                        }}
                      />

                      <Button
                        icon="import"
                        text="Import CSV"
                        minimal={true}
                        onClick={this.importCsv}
                      />

                      <CsvImport
                        isOpen={this.importCsvOpen}
                        onCsvImport={this.handleCsvImport}
                        onImportCancel={() => {
                          this.importCsvOpen = false;
                        }}
                      />
                    </Navbar.Group>
                  </Navbar>

                  <div className={dataModuleStyle.className}>
                    {this.loadingError != null ? (
                      <div>{this.loadingError}</div>
                    ) : null}

                    <Table
                      numRows={
                        this.props.editorState.chartData
                          ? this.props.editorState.chartData.length
                          : 0
                      }
                      enableRowHeader={true}
                      enableRowReordering={true}
                      enableMultipleSelection={true}
                      onRowsReordered={this.handleRowsReordered}
                    >
                      {this.columns.map(name => {
                        return (
                          <Column
                            id={name}
                            name={name}
                            key={name}
                            cellRenderer={this.renderCell}
                            columnHeaderCellRenderer={this.renderColumnHeader}
                          />
                        );
                      })}
                    </Table>
                  </div>
                </div>
              }
            />
          )}
          <Tabs.Expander />
          <Tab
            id="json"
            title="JSON"
            className={dataTabStyle.className}
            panel={
              <CodeEditor
                value={this.beautifiedJsonData}
                mode="javascript"
                onValueChange={newValue => {
                  this.handleCodeChanged(newValue);
                }}
                onBlur={this.handleEditorBlur}
              />
            }
          />
        </Tabs>
      </div>
    );
  }
}

export default Data;
