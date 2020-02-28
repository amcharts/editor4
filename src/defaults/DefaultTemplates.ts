import ITemplateGroup from '../classes/ITemplateGroup';
// eslint-disable-next-line
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import barTemplateGroup from './templates/BarTemplateGroup';
import lineTemplateGroup from './templates/LineTemplateGroup';
import columnTemplateGroup from './templates/ColumnTemplateGroup';
import areaTemplateGroup from './templates/AreaTemplateGroup';
import mixedXYTemplateGroup from './templates/mixedXYTemplateGroup';
import pieTemplateGroup from './templates/PieTemplateGroup';
import otherTemplateGroup from './templates/otherTemplateGroup';

const defaultTemplates: ITemplateGroup[] = [
  barTemplateGroup,
  columnTemplateGroup,
  lineTemplateGroup,
  areaTemplateGroup,
  mixedXYTemplateGroup,
  pieTemplateGroup,
  otherTemplateGroup
];

export default defaultTemplates;
