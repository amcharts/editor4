/* eslint-disable import/first */
export { EditorLauncher } from './EditorLauncher';
export {
  ILauncherTarget,
  ILauncherConfig,
  ILauncherEventArguments,
  LauncherEventHandler,
  LauncherEventType
} from './config/ILauncherConfig';
export { IEngineConfig, IThemeInfo } from './../../src/classes/IEngineConfig';
export { default as ITemplate } from './../../src/classes/ITemplate';
export { default as ITemplateGroup } from './../../src/classes/ITemplateGroup';

export {
  default as IConfig,
  ModuleType,
  IPresetData
} from './../../src/classes/IConfig';

export {
  Language,
  ITranslationBlock,
  ITranslationPack
} from './../../src/utils/Language';

// workaround for declarations not being exported
import './../../src/classes/IConfig';
import './../../src/components/core/IChartData';
import './../../src/classes/ITemplate';
import './../../src/classes/ITemplateGroup';
import './../../src/classes/IEngineConfig';
import './../../src/utils/Language';
