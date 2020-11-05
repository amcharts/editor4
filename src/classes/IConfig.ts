import ITemplateGroup from './ITemplateGroup';
import { IEngineConfig } from './IEngineConfig';
import { IChartData } from './../components/core/IChartData';
import { ITranslationPack } from './../utils/Language';

/**
 * Editor modules.
 *
 * * **home** - let's users create new charts based on supplied templates or import their configs.
 * * **design** - the main WYSIWYG chart editor screen
 * * **data** - data-grid editor
 * * **code** - output code for the chart in several variations
 */
export type ModuleType = 'home' | 'design' | 'data' | 'code' | 'share';

/**
 * Editor configuration.
 */
export default interface IConfig {
  /**
   * Available chart templates.
   *
   * If set these templates will be presented to the user on the Home screen of the Editor.
   * Set [[allowDefaultTemplates]] to `true` to display built-in (bundled) templates instead.
   */
  templates?: ITemplateGroup[];
  /**
   * Enabled Editor modules.
   *
   * List editor modules that should be accessible to the user.
   * Supported values `'home' | 'design' | 'data' | 'code'`
   */
  enabledModules?: ModuleType[];
  /**
   * Object-style (JSON) chart configuration for editing.
   *
   * Leave unset when creating a new chart or set to an existing configuration for editing.
   * You can also pass the configuration via the argument to the [[EditorLauncher.launch()]] method.
   */
  chartConfig?: object;
  /**
   * Data to use in place of template data
   * when creating a new chart.
   *
   * Set this to your dataset when you want users to create charts based on your existing data.
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
   *
   * You can set amCharts themes and license numbers via this property.
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
   *
   * Your dataset as an array of name: value objects
   */
  data: Array<IChartData>;
  /**
   * Mapping of the actual preset data to standard template fields.
   *
   * To use your data the Editor needs to know what fields in your dataset correspond to standard template fields.
   *
   * For example, in the code below the suppiled dataset has `cat` and `val` fields and the typical
   * serial chart template has `category` and `value` (or `value1`, `value2`, etc.) fields.
   * So, we supply a map mapping `category` to `cat`, and `value` and `value1` to `val`.
   *
   * ```JavaScript
   * presetData: {
   *   data: [
   *     { cat: 'c1', val: 10 },
   *     { cat: 'c2', val: 20 },
   *     { cat: 'c3', val: 40 },
   *     { cat: 'c4', val: 18 }
   *   ],
   *   templatePropertyMap: new Map([
   *     ['category', 'cat'],
   *     ['value', 'val'],
   *     ['value1', 'val']
   *   ])
   * }
   * ```
   */
  templatePropertyMap: Map<string, string>;
}
