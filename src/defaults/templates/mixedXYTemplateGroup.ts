import ITemplateGroup from '../../classes/ITemplateGroup';
import twoValueAxesColumnLineTemplate from './bar/TwoValueAxesColumnLineTemplate';
import columnLineTemplate from './bar/ColumnLineTemplate';
import columnAreaTemplate from './bar/ColumnAreaTemplate';

const mixedXYTemplateGroup: ITemplateGroup = {
  name: 'Mixed XY',
  templates: [
    columnLineTemplate,
    twoValueAxesColumnLineTemplate,
    columnAreaTemplate
  ]
};

export default mixedXYTemplateGroup;
