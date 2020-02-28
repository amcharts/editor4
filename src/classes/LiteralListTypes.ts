import ILiteralListTypes from './ILiteralListTypes';

export default class LiteralListTypes {
  public literalTypes: ILiteralListTypes = {};

  public getTypeValues(forType: string): string[] | undefined {
    if (this.literalTypes[forType]) {
      return JSON.parse(JSON.stringify(this.literalTypes[forType]));
    }
  }
}
