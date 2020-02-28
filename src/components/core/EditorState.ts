import { observable } from 'mobx';
import Property from '../../classes/Property';
import { IChartData } from './IChartData';
import IConfig, { IPresetData } from '../../classes/IConfig';

export default class EditorState {
  @observable public chartProperties?: Property;
  @observable public chartData?: Array<IChartData>;
  @observable public presetData?: IPresetData;
  @observable public appliedThemes?: string[];
  @observable public licenseNumbers?: string[];
  @observable public editorConfig: IConfig = {
    templates: [],
    enabledModules: undefined
  };
  @observable public isBusy = false;
}
