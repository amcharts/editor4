import ITemplateGroup from '../../classes/ITemplateGroup';
import clusteredColumnTemplate from './bar/ClusteredColumnTemplate';
import simpleColumnTemplate from './bar/SimpleColumnTemplate';
import stackedColumnTemplate from './bar/StackedColumnTemplate';
import stacked100ColumnTemplate from './bar/Stacked100ColumnTemplate';
import clustered3dColumnTemplate from './bar/Clustered3dColumnTemplate';
import simple3dColumnTemplate from './bar/Simple3dColumnTemplate';
import stacked3dColumnTemplate from './bar/Stacked3dColumnTemplate';
import stacked3d100ColumnTemplate from './bar/Stacked3d100ColumnTemplate';
import columnScrollTemplate from './bar/ColumnScrollTemplate';
import twoValueAxesColumnTemplate from './bar/TwoValueAxesColumnTemplate';
import floatingColumnTemplate from './bar/FloatingColumnTemplate';
import logColumnTemplate from './bar/LogColumnTemplate';
import dateColumnTemplate from './bar/DateColumnTemplate';
import colorHighlightColumnTemplate from './bar/ColorHighlightColumnTemplate';
import column3dTemplate from './bar/Column3dTemplate';
import clusteredStackedColumnTemplate from './bar/ClusteredStackedColumnTemplate';

const columnTemplateGroup: ITemplateGroup = {
  name: 'Column',
  templates: [
    simpleColumnTemplate,
    clusteredColumnTemplate,
    stackedColumnTemplate,
    stacked100ColumnTemplate,
    clusteredStackedColumnTemplate,
    simple3dColumnTemplate,
    column3dTemplate,
    clustered3dColumnTemplate,
    stacked3dColumnTemplate,
    stacked3d100ColumnTemplate,
    columnScrollTemplate,
    floatingColumnTemplate,
    twoValueAxesColumnTemplate,
    logColumnTemplate,
    dateColumnTemplate,
    colorHighlightColumnTemplate
  ]
};

export default columnTemplateGroup;
