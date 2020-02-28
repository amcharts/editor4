import ITemplateGroup from '../../classes/ITemplateGroup';
import simpleAreaTemplate from './line/SimpleAreaTemplate';
import twoAreasTemplate from './line/TwoAreasTemplate';
import stackedAreaTemplate from './line/StackedAreaTemplate';
import stacked100AreaTemplate from './line/Stacked100AreaTemplate';
import dateAreaTemplate from './line/DateAreaTemplate';
import dateAreaScrollTemplate from './line/DateAreaScrollTemplate';

const areaTemplateGroup: ITemplateGroup = {
  name: 'Area',
  templates: [
    simpleAreaTemplate,
    twoAreasTemplate,
    stackedAreaTemplate,
    stacked100AreaTemplate,
    dateAreaTemplate,
    dateAreaScrollTemplate
  ]
};

export default areaTemplateGroup;
