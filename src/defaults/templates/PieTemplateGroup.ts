import ITemplateGroup from '../../classes/ITemplateGroup';
import simplePieTemplate from './pie/SimplePieTemplate';
import simpleDonutTemplate from './pie/SimpleDonutTemplate';
import pie3dTemplate from './pie/Pie3dTemplate';
import donut3dTemplate from './pie/Donut3dTemplate';
import nestedDonutTemplate from './pie/NestedDonutTemplate';
import donutRoundedTemplate from './pie/DonutRoundedTemplate';

const pieTemplateGroup: ITemplateGroup = {
  name: 'Pie & Donut',
  templates: [
    simplePieTemplate,
    pie3dTemplate,
    simpleDonutTemplate,
    donut3dTemplate,
    donutRoundedTemplate,
    nestedDonutTemplate
  ]
};

export default pieTemplateGroup;
