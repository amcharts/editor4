import ITemplateGroup from '../../classes/ITemplateGroup';
import basicRadarTemplate from './other/BasicRadarTemplate';
import simpleGaugeChart from './other/SimpleGaugeTemplate';
import simpleSankeyTemplate from './other/SankeyTemplate';
import simpleTreemapTemplate from './other/SimpleTreemapTemplate';

const otherTemplateGroup: ITemplateGroup = {
  name: 'Other',
  templates: [
    basicRadarTemplate,
    simpleGaugeChart,
    simpleSankeyTemplate,
    simpleTreemapTemplate
  ]
};

export default otherTemplateGroup;
