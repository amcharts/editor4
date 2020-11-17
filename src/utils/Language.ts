import en from './lang/en/en';

/**
 * Name:value pairs for translation (localization) strings in a string block.
 *
 * Translations are grouped into 3 blocks (see [[ITranslationPack]]).
 *
 * Eg.
 * ```javascript
 * {
 *   'app.title': 'Chart Editor',
 *   'app.save_button': 'save',
 *   'app.close_button': 'close',
 *   ...
 * }
 * ```
 */
export interface ITranslationBlock {
  /**
   * Single translation string. Eg.
   * ```javascript
   * 'app.title': 'Chart Editor'
   * ```
   */
  [key: string]: string;
}

/**
 * Describes a set of localization (translation) strings for the Editor.
 *
 * The translations are grouped into 3 distinct blocks:
 *
 * * **ui** - user interface translations
 *
 * * **common** - chart element properties commonly found in multiple chart elements
 *
 * * **properties** - unique chart element properties for specific element types
 *
 * When localization engine looks for property name translations it first looks
 * in `properties` for a class-specific translation and then, if not found,
 * looks in `common`.
 */
export interface ITranslationPack {
  /**
   * User interface translations
   */
  ui: ITranslationBlock;
  /**
   * Translations for chart element properties commonly found in multiple chart elements
   */
  common: ITranslationBlock;
  /**
   * Translations for unique chart element properties for specific element types
   */
  properties: ITranslationBlock;
}

/**
 * @ignore
 */
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
      // return `[[${translation}]]`;
      return translation;
    } else if (fallback !== undefined) {
      // @todo comment next block after initial setup
      if (!id.startsWith('template_title.')) {
        console.log(`localization not found: '${id}': '${fallback}'`);
      }
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
