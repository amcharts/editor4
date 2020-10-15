import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { stretch } from '../../../utils/Prefixes';
import { StyleClass, css, StyleSelector } from '../../../utils/Style';

import IBaseProps from '../../core/IBaseProps';
import { IChartData } from '../../core/IChartData';
import EditorState from '../../core/EditorState';
import {
  observable,
  computed,
  action,
  keys,
  observe,
  IValueDidChange
} from 'mobx';
import { RouteComponentProps } from 'react-router-dom';

import {
  Button,
  Tabs,
  Tab,
  Classes,
  ButtonGroup,
  Alert,
  Intent,
  Popover,
  Callout
} from '@blueprintjs/core';
import { Menu, MenuItem, Navbar, Alignment } from '@blueprintjs/core';
import {
  Column,
  Table,
  EditableCell,
  EditableName,
  ColumnHeaderCell,
  IRegion
} from '@blueprintjs/table';
import CodeEditor from '../../core/CodeEditor';
import jsbeautifier from 'js-beautify';
import CsvImport from './CsvImport';
import PropertyConfigManager from '../../../classes/PropertyConfigManager';
import FileImport from './FileImport';
import Property from '../../../classes/Property';

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
          if (
            !window.confirm(
              this.props.editorState.language.getUiTranslation(
                'data.column_empty_prompt',
                'Column cannot be empty, delete column?'
              )
            )
          ) {
            this.currentName = this.props.oldName;
            return;
          }

          this.props.editorState.chartData.forEach(x => {
            delete x[oldName];
          });
        } else {
          if (this.props.columns.indexOf(newName) !== -1) {
            // TODO replace with dialog box
            if (
              !window.confirm(
                this.props.editorState.language.getUiTranslation(
                  'data.column_exists_prompt',
                  'Column already exists, merge columns?'
                )
              )
            ) {
              this.currentName = this.props.oldName;
              return;
            }
          }

          this.props.editorState.chartData.forEach(x => {
            // rewrite the whole object to preserve order
            Object.keys(x).forEach(k => {
              if (k !== oldName) {
                x[`_${k}`] = x[k];
              } else {
                x[`_${newName}`] = x[k];
              }
              delete x[k];
            });
            Object.keys(x).forEach(k => {
              if (k !== oldName) {
                x[k.substr(1)] = x[k];
              }
              delete x[k];
            });
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
  flex-direction: column;
  max-height: 100%;
`);

const dataTabsStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  overflow: hidden;
  margin: 10px;
  margin-top: 0px;
  padding-bottom: 50px;
`);

const dataTabStyle = new StyleClass(css`
  display: flex;
  max-height: 100%;
  overflow: auto;
  background-color: #2b3e50;
`);

const dataTabStyleCode = new StyleClass(css`
  display: flex;
`);

const externalDataMessageStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  overflow: hidden;
  align-items: center;
  justify-content: center;
`);

const externalDataCalloutStyle = new StyleClass(css`
  max-width: 400px;
`);

new StyleSelector(
  `.${Classes.TAB_PANEL}`,
  css`
    flex-grow: 2;
    margin-top: 5px;
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
  `
);

interface IDataProps extends IBaseProps, RouteComponentProps {}

@observer
class Data extends Component<IDataProps> {
  @observable loadingError: string | null = null;
  @observable jsonDataString = '';
  @observable importCsvOpen = false;
  @observable importFileOpen = false;
  @observable isDeleteRowsOpen = false;
  @observable isDeleteColsOpen = false;
  @observable selectedRegions: IRegion[] = [];

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

      // @todo: was there any functional reason to sort?
      // columns.sort((x, y) => {
      //   if (x === y) {
      //     return 0;
      //   } else if (x < y) {
      //     return -1;
      //   } else {
      //     return 1;
      //   }
      // });
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

  @computed private get isExternalDataSource(): boolean {
    let result = false;

    const p = this.props.editorState.chartProperties;
    if (p !== undefined && p.properties !== undefined) {
      const dsProp = p.properties.find(prop => prop.name === 'dataSource');
      if (dsProp !== undefined && dsProp.value !== undefined) {
        result =
          (dsProp.value as Property).getStringPropertyValue('url') !==
          undefined;
      }
    }

    return result;
  }

  public componentDidMount() {
    this.setJsonDataString();

    observe(this, 'columns', this.columnsChanged);
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

  @action.bound
  removeRows() {
    if (this.selectedRegions.length > 0) {
      const rowsToRemove: number[] = [];
      this.selectedRegions.forEach(region => {
        if (region.rows) {
          for (let r = region.rows[0]; r <= region.rows[1]; r++) {
            if (rowsToRemove.indexOf(r) < 0) {
              rowsToRemove.push(r);
            }
          }
        }
      });

      if (rowsToRemove.length > 0) {
        rowsToRemove.sort((r1, r2) => r2 - r1);
        rowsToRemove.forEach(r => {
          if (this.props.editorState.chartData !== undefined) {
            this.props.editorState.chartData.splice(r, 1);
          }
        });
      }
    }
    this.isDeleteRowsOpen = false;
  }

  @action.bound
  removeColumns() {
    if (this.selectedRegions.length > 0) {
      const columnsToRemove: number[] = [];
      this.selectedRegions.forEach(region => {
        if (region.cols) {
          for (let r = region.cols[0]; r <= region.cols[1]; r++) {
            if (columnsToRemove.indexOf(r) < 0) {
              columnsToRemove.push(r);
            }
          }
        }
      });

      if (columnsToRemove.length > 0) {
        const columnNamesToRemove = this.columns.filter(
          (name, index) => columnsToRemove.indexOf(index) > -1
        );

        if (this.props.editorState.chartData) {
          this.props.editorState.chartData.forEach(dataItem => {
            columnNamesToRemove.forEach(columnName => {
              if (Object.keys(dataItem).indexOf(columnName) > -1) {
                delete dataItem[columnName];
              }
            });
          });
        }
      }
    }
    this.isDeleteColsOpen = false;
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
  transformToNumber() {
    this.transformData('number');
  }

  @action.bound
  transformToString() {
    this.transformData('string');
  }

  @action.bound
  transformData(target: 'number' | 'string') {
    if (this.selectedRegions.length > 0) {
      this.selectedRegions.forEach(r => {
        if (
          this.props.editorState.chartData &&
          this.props.editorState.chartData.length > 0
        ) {
          const rows = r.rows
            ? r.rows
            : [0, this.props.editorState.chartData.length - 1];
          const colsNumbers = r.cols
            ? r.cols
            : [0, Object.keys(this.props.editorState.chartData[0]).length - 1];
          const cols: string[] = [];
          for (let c = colsNumbers[0]; c <= colsNumbers[1]; c++) {
            cols.push(Object.keys(this.props.editorState.chartData[0])[c]);
          }

          for (let r = rows[0]; r <= rows[1]; r++) {
            cols.forEach(col => {
              /* eslint-disable @typescript-eslint/no-non-null-assertion */
              if (target === 'number') {
                const tryParseResult = parseFloat(
                  this.props.editorState.chartData![r][col]
                );
                if (!isNaN(tryParseResult)) {
                  this.props.editorState.chartData![r][col] = tryParseResult;
                }
              } else if (target === 'string') {
                this.props.editorState.chartData![r][
                  col
                ] = this.props.editorState.chartData![r][col].toString();
              }
              /* eslint-enable @typescript-eslint/no-non-null-assertion */
            });
          }
        }
      });
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
        this.loadingError = this.props.editorState.language.getUiTranslation(
          'data.json_not_array_error',
          'JSON data must be an array'
        );
      }
    } catch {
      this.loadingError = this.props.editorState.language.getUiTranslation(
        'data.json_format_error',
        'Malformed JSON'
      );
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
  handleSelection(selectedRegions: IRegion[]) {
    this.selectedRegions = selectedRegions;
  }

  @action.bound
  private handleCodeChanged(newCode: string) {
    this.jsonDataString = newCode;
  }

  @action.bound
  private handleEditorBlur() {
    this.setData(this.jsonDataString);
  }

  @action.bound
  private columnsChanged(ev: IValueDidChange<this['columns']>) {
    if (this.props.editorState.chartProperties && ev.oldValue && ev.newValue) {
      PropertyConfigManager.adjustDataFields(
        this.props.editorState.chartProperties,
        ev.oldValue,
        ev.newValue
      );
    }
  }

  public render() {
    const lang = this.props.editorState.language;
    if (!this.isExternalDataSource) {
      return (
        <div className={dataStyle.className}>
          <Navbar className={`${toolbarStyle.className}`}>
            <Navbar.Group align={Alignment.LEFT}>
              <ButtonGroup minimal={true} large={true}>
                <Button
                  rightIcon="add-column-left"
                  text={lang.getUiTranslation('data.add_column_button', 'Add')}
                  title={lang.getUiTranslation(
                    'data.add_column_button_title',
                    'Add column'
                  )}
                  onClick={this.addColumn}
                />
                <Button
                  icon="add-row-bottom"
                  title={lang.getUiTranslation(
                    'data.add_row_button_title',
                    'Add row'
                  )}
                  onClick={this.addRow}
                />
              </ButtonGroup>
              <ButtonGroup minimal={true} large={true}>
                <Button
                  rightIcon="remove-column-left"
                  text={lang.getUiTranslation(
                    'data.remove_column_button',
                    'Remove'
                  )}
                  title={lang.getUiTranslation(
                    'data.remove_column_button_title',
                    'Remove column(s)'
                  )}
                  disabled={this.selectedRegions.length < 1}
                  onClick={() => {
                    this.isDeleteColsOpen = true;
                  }}
                />
                <Alert
                  isOpen={this.isDeleteColsOpen}
                  icon="trash"
                  intent={Intent.DANGER}
                  confirmButtonText={lang.getUiTranslation(
                    'data.delete_button_text',
                    'Delete'
                  )}
                  cancelButtonText={lang.getUiTranslation(
                    'data.cancel_button_text',
                    'Cancel'
                  )}
                  onConfirm={this.removeColumns}
                  onCancel={() => {
                    this.isDeleteColsOpen = false;
                  }}
                >
                  <p>
                    {lang.getUiTranslation(
                      'data.delete_columns_prompt',
                      'Delete selected column(s)?'
                    )}
                  </p>
                </Alert>
                <Button
                  icon="remove-row-bottom"
                  title={lang.getUiTranslation(
                    'data.remove_row_button_title',
                    'Remove row(s)'
                  )}
                  disabled={this.selectedRegions.length < 1}
                  onClick={() => {
                    this.isDeleteRowsOpen = true;
                  }}
                />
                <Alert
                  isOpen={this.isDeleteRowsOpen}
                  icon="trash"
                  intent={Intent.DANGER}
                  confirmButtonText={lang.getUiTranslation(
                    'data.delete_button_text',
                    'Delete'
                  )}
                  cancelButtonText={lang.getUiTranslation(
                    'data.cancel_button_text',
                    'Cancel'
                  )}
                  onConfirm={this.removeRows}
                  onCancel={() => {
                    this.isDeleteRowsOpen = false;
                  }}
                >
                  <p>
                    {lang.getUiTranslation(
                      'data.delete_rows_prompt',
                      'Delete selected row(s)?'
                    )}
                  </p>
                </Alert>
              </ButtonGroup>
            </Navbar.Group>
            <Navbar.Divider />
            <Popover
              content={
                <Menu>
                  <MenuItem
                    text={lang.getUiTranslation(
                      'data.transform_to_number',
                      'number'
                    )}
                    onClick={this.transformToNumber}
                  />
                  <MenuItem
                    text={lang.getUiTranslation(
                      'data.transform_to_string',
                      'string'
                    )}
                    onClick={this.transformToString}
                  />
                </Menu>
              }
            >
              <Button
                minimal={true}
                text={lang.getUiTranslation(
                  'data.transform_to_button',
                  'Transform to ...'
                )}
                disabled={this.selectedRegions.length < 1}
                rightIcon="caret-down"
              />
            </Popover>
            <Navbar.Divider />
            <Navbar.Group align={Alignment.LEFT}>
              <Button
                icon="import"
                text={lang.getUiTranslation(
                  'data.file_import_button',
                  'File import'
                )}
                minimal={true}
                onClick={this.importFile}
              />

              <FileImport
                lang={this.props.editorState.language}
                isOpen={this.importFileOpen}
                onFileImport={this.handleFileImport}
                onImportCancel={() => {
                  this.importFileOpen = false;
                }}
              />

              <Button
                icon="clipboard"
                text={lang.getUiTranslation(
                  'data.paste_csv_button',
                  'Paste CSV'
                )}
                minimal={true}
                onClick={this.importCsv}
              />

              <CsvImport
                lang={this.props.editorState.language}
                isOpen={this.importCsvOpen}
                onCsvImport={this.handleCsvImport}
                onImportCancel={() => {
                  this.importCsvOpen = false;
                }}
              />
            </Navbar.Group>
          </Navbar>

          <Tabs
            large={true}
            defaultSelectedTabId={this.isFlat ? 'table1' : 'json'}
            className={dataTabsStyle.className}
            renderActiveTabPanelOnly={true}
          >
            {this.isFlat && (
              <Tab
                id="table1"
                title={lang.getUiTranslation('data.table_tab', 'Table')}
                className={dataTabStyle.className}
                panel={
                  <div className={dataPanelStyle.className}>
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
                        onSelection={this.handleSelection}
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
              title={lang.getUiTranslation('data.json_tab', 'JSON')}
              className={dataTabStyleCode.className}
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
    } else {
      return (
        <div className={dataStyle.className}>
          <div className={externalDataMessageStyle.className}>
            <Callout
              intent="primary"
              className={externalDataCalloutStyle.className}
            >
              {lang.getUiTranslation(
                'data.external_data',
                'chart uses external data source'
              )}
            </Callout>
          </div>
        </div>
      );
    }
  }
}

export default Data;
