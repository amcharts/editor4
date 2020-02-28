import ITemplateGroup from '../../classes/ITemplateGroup';
import simpleLineTemplate from './line/SimpleLineTemplate';
import twoLinesTemplate from './line/TwoLinesTemplate';
import verticalLineTemplate from './line/VerticalLineTemplate';
import dateLineTemplate from './line/DateLineTemplate';
import dateLineScrollTemplate from './line/DateLineScrollTemplate';
import smoothedDateLineTemplate from './line/SmoothedDateLineTemplate';
import stepLineTemplate from './line/StepLineTemplate';
import stepLineNoRisersTemplate from './line/StepLineNoRisersTemplate';

const lineTemplateGroup: ITemplateGroup = {
  name: 'Line',
  templates: [
    simpleLineTemplate,
    twoLinesTemplate,
    verticalLineTemplate,
    dateLineTemplate,
    dateLineScrollTemplate,
    smoothedDateLineTemplate,
    stepLineTemplate,
    stepLineNoRisersTemplate
  ]
};

export default lineTemplateGroup;
