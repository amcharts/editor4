import React, { Component } from 'react';
import { observer } from 'mobx-react';

import IBaseProps from '../../core/IBaseProps';

import editorTheme from '../../../themes/editor/EditorTheme';
import { StyleClass, css, StyleSelector } from '../../../utils/Style';
import {
  Button,
  Collapse,
  Icon,
  Popover,
  Menu,
  MenuItem,
  Intent,
  Text,
  InputGroup
} from '@blueprintjs/core';
import PropertyGridState from './PropertyGridState';
import { IThemeInfo } from '../../../classes/IEngineConfig';
import { observable } from 'mobx';
import ConfirmationDialog from '../../core/ConfirmationDialog';
import { Language } from '../../../utils/Language';

const propertyGroupStyle = new StyleClass(css`
  border-bottom: 1px solid ${editorTheme.propertyPanelGridColor};
  margin: 0px;
`);

const propertyGroupOpenStyle = new StyleClass(css`
  background-color: ${editorTheme.propertyPanelItemExpandedBackground};
`);

const propertyGroupTitleStyle = new StyleClass(css`
  display: flex;
  margin: 0px;
  padding: 10px 0px 10px 1em;
`);
new StyleSelector(
  `.${propertyGroupTitleStyle.className}:hover`,
  css`
    background-color: ${editorTheme.propertyPanelItemHoverBackground};
    cursor: pointer;
  `
);
new StyleSelector(
  `.${propertyGroupTitleStyle.className} h4`,
  css`
    margin: 0px;
  `
);

const propertyGroupTitleIconStyle = new StyleClass(css`
  margin-right: 10px;
  color: ${editorTheme.propertyPanelAccentColor};
`);

const propertyEditorListStyle = new StyleClass(css`
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorListLabelStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${editorTheme.propertyPanelGridColor};
  padding: 0px 0.3em 0px 1em;
`);

const editorLabelTextStyle = new StyleClass(css`
  display: flex;
  cursor: pointer;
`);

const editorLabelIconStyle = new StyleClass(css`
  margin-right: 10px;
`);

const propertyEditorListActionRowStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0px;
`);

const propertyEditorListItemListStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: column;
`);

const propertyEditorListItemRowStyle = new StyleClass(css`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  border-bottom: 1px solid transparent;
  padding-right: 0.3em;
  background-color: ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorListItemObjectStyle = new StyleClass(css`
  flex-grow: 2;
  overflow: hidden;
  display: flex;
  padding: 10px 0.3em 10px 1em;
  cursor: pointer;
`);
const propertyEditorListItemObjectButtonStyle = new StyleClass(css`
  color: ${editorTheme.propertyPanelAccentColor};
`);

const editorListItemIconStyle = new StyleClass(css`
  margin-right: 10px;
`);

const propertyEditorListItemActionBoxStyle = new StyleClass(css`
  padding: 10px 0px;
`);

const propertyEditorStyle = new StyleClass(css`
  display: flex;
  flex-direction: row;
  border-top: 1px solid ${editorTheme.propertyPanelGridColor};
`);

const propertyEditorLabelStyle = new StyleClass(css`
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0.3em 10px 1em;
`);

const propertyEditorEditStyle = new StyleClass(css`
  padding: 10px 0.3em 10px 0.3em;
  width: 50%;
`);

/**
 * Props for the PropertyGroup.
 *
 * @interface IPropertyGroupProps
 * @extends {IBaseProps}
 */
interface IEngineSettingsPanelProps extends IBaseProps {
  lang: Language;
  gridState: PropertyGridState;
  onExpandedChange: (groupName: string) => void;
}

@observer
class EngineSettingsPanel extends Component<IEngineSettingsPanelProps> {
  @observable private licenseNumbersString = '';

  public constructor(props: Readonly<IEngineSettingsPanelProps>) {
    super(props);

    this.getThemeInfoByName = this.getThemeInfoByName.bind(this);
    this.setLicenseNumbersString = this.setLicenseNumbersString.bind(this);

    // expand by default
    if (
      this.props.gridState.groupExpandedStates['engine-themes'] === undefined &&
      this.props.onExpandedChange !== undefined
    ) {
      this.props.onExpandedChange('engine-themes');
    }
  }

  public componentDidMount() {
    this.setLicenseNumbersString();
  }

  private setLicenseNumbersString() {
    if (
      this.props.editorState.licenseNumbers &&
      this.props.editorState.licenseNumbers.length > 0
    ) {
      this.licenseNumbersString = this.props.editorState.licenseNumbers.join(
        ','
      );
    }
  }

  public render() {
    const lang = this.props.lang;
    const engineConfig = this.props.editorState.editorConfig.engineConfig;
    let appliedThemeInfos: IThemeInfo[] = [];
    if (
      this.props.editorState.appliedThemes &&
      this.props.editorState.appliedThemes.length > 0
    ) {
      const foundAppliedThemeNames = this.props.editorState.appliedThemes.filter(
        themeName => this.getThemeInfoByName(themeName) !== undefined
      );
      appliedThemeInfos = foundAppliedThemeNames.map(themeName => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.getThemeInfoByName(themeName)!;
      });
    }

    return (
      <div className={propertyGroupStyle.className}>
        <div
          className={propertyGroupTitleStyle.className}
          onClick={() => this.props.onExpandedChange('engine')}
        >
          <Icon icon="cog" className={propertyGroupTitleIconStyle.className} />
          <h4>
            {lang.getUiTranslation(
              'engine_settings_panel.engine_settings',
              'Engine settings'
            )}
          </h4>
        </div>

        <Collapse
          isOpen={this.props.gridState.groupExpandedStates['engine']}
          className={propertyGroupOpenStyle.className}
        >
          {engineConfig &&
            engineConfig.availableThemes &&
            engineConfig.availableThemes.length > 0 && (
              <div key="themes" className={propertyEditorListStyle.className}>
                <div className={propertyEditorListLabelStyle.className}>
                  <div
                    className={editorLabelTextStyle.className}
                    onClick={() => {
                      if (this.props.onExpandedChange !== undefined) {
                        this.props.onExpandedChange('engine-themes');
                      }
                    }}
                  >
                    <Icon
                      icon="style"
                      className={editorLabelIconStyle.className}
                    />
                    <div>
                      {lang.getUiTranslation(
                        'engine_settings_panel.themes',
                        'Themes'
                      )}
                    </div>
                  </div>
                  <div className={propertyEditorListActionRowStyle.className}>
                    <div>
                      {engineConfig &&
                        engineConfig.availableThemes &&
                        engineConfig.availableThemes.length > 0 && (
                          <Popover
                            position="auto"
                            minimal={true}
                            content={
                              <Menu key="available-themes">
                                {engineConfig.availableThemes.map(theme => (
                                  <MenuItem
                                    key={`available-theme-${theme.name}`}
                                    text={theme.label}
                                    disabled={
                                      appliedThemeInfos.find(
                                        ti => ti.name === theme.name
                                      ) !== undefined
                                    }
                                    onClick={() => {
                                      if (this.props.onThemeChange) {
                                        this.props.onThemeChange({
                                          addThemeName: theme.name
                                        });
                                      }
                                    }}
                                  />
                                ))}
                              </Menu>
                            }
                          >
                            <Button
                              small={true}
                              minimal={true}
                              icon="plus"
                              title={lang.getUiTranslation(
                                'engine_settings_panel.theme_add',
                                'add'
                              )}
                              intent={Intent.SUCCESS}
                            />
                          </Popover>
                        )}
                    </div>
                  </div>
                </div>
                <Collapse
                  isOpen={
                    this.props.gridState.groupExpandedStates['engine-themes']
                  }
                >
                  <div className={propertyEditorListItemListStyle.className}>
                    {appliedThemeInfos.map((theme, index) => (
                      <div
                        key={'applied-theme-' + theme.name}
                        className={propertyEditorListItemRowStyle.className}
                      >
                        <div
                          className={
                            propertyEditorListItemObjectStyle.className
                          }
                          title={theme.label}
                        >
                          <Icon
                            icon="drag-handle-vertical"
                            className={editorListItemIconStyle.className}
                          />
                          <Text
                            ellipsize={true}
                            className={
                              propertyEditorListItemObjectButtonStyle.className
                            }
                          >
                            {theme.label}
                          </Text>
                        </div>
                        <div
                          className={
                            propertyEditorListItemActionBoxStyle.className
                          }
                        >
                          <Popover
                            content={
                              <ConfirmationDialog
                                title={lang.getUiTranslation(
                                  'engine_settings_panel.remove_theme_prompt',
                                  'Remove theme?'
                                )}
                                confirmText={lang.getUiTranslation(
                                  'engine_settings_panel.remove_theme_confirm',
                                  'Remove'
                                )}
                                onConfirmClick={() => {
                                  if (this.props.onThemeChange) {
                                    this.props.onThemeChange({
                                      removeThemeName: theme.name
                                    });
                                  }
                                }}
                              />
                            }
                          >
                            <Button
                              small={true}
                              minimal={true}
                              icon="cross"
                              intent={Intent.NONE}
                            />
                          </Popover>
                        </div>
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>
            )}
          <div key="licenses-editor" className={propertyEditorStyle.className}>
            <div className={propertyEditorLabelStyle.className}>
              <Text ellipsize={true}>
                {lang.getUiTranslation(
                  'engine_settings_panel.licenses',
                  'Licenses'
                )}
              </Text>
            </div>
            <div className={propertyEditorEditStyle.className}>
              <InputGroup
                small={true}
                value={this.licenseNumbersString}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  this.licenseNumbersString = event.target.value;
                  if (this.props.onLicensesChange) {
                    let newValue: string[] | undefined;
                    if (
                      event.target.value !== undefined &&
                      event.target.value !== ''
                    ) {
                      const newArray = event.target.value.split(',');
                      newValue = newArray
                        .map(v => v.trim())
                        .filter(v => v !== '');
                    }
                    this.props.onLicensesChange(newValue);
                  }
                }}
              />
            </div>
          </div>
        </Collapse>
      </div>
    );
  }

  private getThemeInfoByName(themeName: string): IThemeInfo | undefined {
    const engineConfig = this.props.editorState.editorConfig.engineConfig;
    if (
      engineConfig &&
      engineConfig.availableThemes &&
      engineConfig.availableThemes.length > 0
    ) {
      const info = engineConfig.availableThemes.find(t => t.name === themeName);
      return info;
    }
    return undefined;
  }
}

export default EngineSettingsPanel;
