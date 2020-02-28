import ITemplateGroup from '../../classes/ITemplateGroup';
import clusteredBarTemplate from './bar/ClusteredBarTemplate';
import simpleBarTemplate from './bar/SimpleBarTemplate';
import stackedBarTemplate from './bar/StackedBarTemplate';
import stacked100BarTemplate from './bar/Stacked100BarTemplate';
import clustered3dBarTemplate from './bar/Clustered3dBarTemplate';
import simple3dBarTemplate from './bar/Simple3dBarTemplate';
import stacked3dBarTemplate from './bar/Stacked3dBarTemplate';
import stacked3d100BarTemplate from './bar/Stacked3d100BarTemplate';
import floatingBarTemplate from './bar/FloatingBarTemplate';
import logBarTemplate from './bar/LogBarTemplate';
import barScrollTemplate from './bar/BarScrollTemplate';
import colorHighlightBarTemplate from './bar/ColorHighlightBarTemplate';
import bar3dTemplate from './bar/Bar3dTemplate';
import clusteredStackedBarTemplate from './bar/ClusteredStackedBarTemplate';

const barTemplateGroup: ITemplateGroup = {
  name: 'Bar',
  templates: [
    simpleBarTemplate,
    clusteredBarTemplate,
    stackedBarTemplate,
    stacked100BarTemplate,
    clusteredStackedBarTemplate,
    simple3dBarTemplate,
    bar3dTemplate,
    clustered3dBarTemplate,
    stacked3dBarTemplate,
    stacked3d100BarTemplate,
    barScrollTemplate,
    floatingBarTemplate,
    logBarTemplate,
    colorHighlightBarTemplate
  ]
};

export default barTemplateGroup;
