import IConfig from './IConfig';
import ITemplateGroup from './ITemplateGroup';
import defaultTemplates from '../defaults/DefaultTemplates';

export default class ConfigManager {
  public static getDefaultConfig(): IConfig {
    const config: IConfig = {};

    config.templates = ConfigManager.getDefaultTemplates();

    config.engineConfig = {
      availableThemes: [
        {
          name: 'am4themes_amcharts',
          label: 'amCharts'
        },
        {
          name: 'am4themes_amchartsdark',
          label: 'amCharts Dark'
        },
        {
          name: 'am4themes_animated',
          label: 'Animated'
        },
        {
          name: 'am4themes_dark',
          label: 'Dark'
        },
        {
          name: 'am4themes_dataviz',
          label: 'DataViz'
        },
        {
          name: 'am4themes_frozen',
          label: 'Frozen'
        },
        {
          name: 'am4themes_kelly',
          label: 'Kelly'
        },
        {
          name: 'am4themes_material',
          label: 'Material'
        },
        {
          name: 'am4themes_microchart',
          label: 'Microchart'
        },
        {
          name: 'am4themes_moonrisekingdom',
          label: 'Moonrise Kingdom'
        },
        {
          name: 'am4themes_spiritedaway',
          label: 'Spirited Away'
        }
      ]
    };

    return config;
  }

  public static getDefaultTemplates(): ITemplateGroup[] | undefined {
    const templates: ITemplateGroup[] = defaultTemplates;

    return templates;
  }
}
