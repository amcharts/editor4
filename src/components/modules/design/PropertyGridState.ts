import { observable } from 'mobx';

interface IExpandedState {
  [index: string]: boolean;
}

export default class PropertyGridState {
  @observable public filter = '';
  @observable public groupExpandedStates: IExpandedState = {};
  @observable public propertyExpandedStates: IExpandedState = {};
}
