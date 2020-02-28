import ITemplateGroup from './ITemplateGroup';
import { IEngineConfig } from './IEngineConfig';
import { IChartData } from '../components/core/IChartData';

export type ModuleType = 'home' | 'design' | 'data' | 'code' | 'share';

export default interface IConfig {
  templates?: ITemplateGroup[];
  enabledModules?: ModuleType[];
  chartConfig?: object;
  presetData?: IPresetData;
  allowDefaultTemplates?: boolean;
  engineConfig?: IEngineConfig;
}

export interface IPresetData {
  data: Array<IChartData>;
  templatePropertyMap: Map<string, string>;
}
