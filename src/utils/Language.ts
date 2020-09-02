import en from './lang/en/en';

export interface ITranslationBlock {
  [key: string]: string;
}

export interface ITranslationPack {
  ui: ITranslationBlock;
  common: ITranslationBlock;
  properties: ITranslationBlock;
}

export class Language {
  private fallbackTranslations: ITranslationPack = en;
  private _translations?: ITranslationPack;
  private locale?: string;

  public set translations(value: ITranslationPack) {
    this._translations = value;
  }

  private getTranslation(
    id: string,
    fallbackBlock: ITranslationBlock,
    block?: ITranslationBlock
  ): string | undefined {
    if (block && Object.keys(block).includes(id)) {
      return block[id];
    } else if (Object.keys(fallbackBlock).includes(id)) {
      return fallbackBlock[id];
    } else {
      return undefined;
    }
  }

  public getUiTranslation(id: string, fallback?: string): string {
    const translation = this.getTranslation(
      id,
      this.fallbackTranslations.ui,
      this._translations ? this._translations.ui : undefined
    );
    if (translation !== undefined) {
      return translation;
    } else if (fallback !== undefined) {
      return fallback;
    } else {
      return id;
    }
  }

  public getLabel(id: string, fallback?: string): string {
    let translation = this.getTranslation(
      id,
      this.fallbackTranslations.properties,
      this._translations ? this._translations.properties : undefined
    );
    if (translation === undefined && id.includes('.')) {
      translation = this.getTranslation(
        id.substr(id.indexOf('.') + 1),
        this.fallbackTranslations.common,
        this._translations ? this._translations.common : undefined
      );
    }

    if (translation !== undefined) {
      return translation;
    } else if (fallback !== undefined) {
      return fallback;
    } else {
      return id;
    }
  }
}
