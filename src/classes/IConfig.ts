import ITemplateGroup from './ITemplateGroup';
import { IEngineConfig } from './IEngineConfig';
import { IChartData } from './../components/core/IChartData';
import { ITranslationPack } from './../utils/Language';

/**
 * Editor modules.
 */
export type ModuleType = 'home' | 'design' | 'data' | 'code' | 'share';

/**
 * Editor configuration.
 */
export default interface IConfig {
  /**
   * Available chart templates.
   */
  templates?: ITemplateGroup[];
  /**
   * Enabled Editor modules.
   */
  enabledModules?: ModuleType[];
  /**
   * Chart configuration for editing.
   */
  chartConfig?: object;
  /**
   * Data to use in place of template data
   * when creating a new chart.
   */
  presetData?: IPresetData;
  /**
   * If set to `true` bundled Editor templates will be displayed.
   * Otherwise, only template supplied through the launcher are available.
   *
   * @default false
   */
  allowDefaultTemplates?: boolean;
  /**
   * Configuration for amCharts 4 engine (am4core).
   */
  engineConfig?: IEngineConfig;
  /**
   * Editor license key
   */
  editorLicense?: string;
  /**
   * Translation prompts.
   */
  language?: ITranslationPack;
}

/**
 * Settings for supplying preset data to be used in place of default template data.
 */
export interface IPresetData {
  /**
   * Actual preset data.
   */
  data: Array<IChartData>;
  /**
   * Mapping of the actual preset data to standard template fields.
   */
  templatePropertyMap: Map<string, string>;
}
