let rootStylesheet: CSSStyleSheet | undefined;

function getStylesheet(): CSSStyleSheet {
  if (rootStylesheet == null) {
    // TODO use createElementNS ?
    const e = document.createElement('style');
    e.type = 'text/css';
    document.head.appendChild(e);
    rootStylesheet = e.sheet as CSSStyleSheet;
  }

  return rootStylesheet;
}

function makeStylesheet(selector: string): CSSStyleRule {
  const root = getStylesheet();

  const index = root.cssRules.length;

  root.insertRule(selector + '{}', index);

  return root.cssRules[index] as CSSStyleRule;
}

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface StyleRule {
  name: string;
  value: string;
}

const parseRegexp = /[ \n\r]*([^ \n\r:;]+)[ \n\r]*:[ \n\r]*([^;]+);/g;
const commentsRegexp = /\/\*[\s\S]*?\*\//g;

function parseStyle(style: string): Array<StyleRule> {
  style = style.replace(commentsRegexp, '');

  const output = [];

  let a;
  let lastIndex = 0;
  let failed = false;

  parseRegexp.lastIndex = lastIndex;

  while ((a = parseRegexp.exec(style)) != null) {
    if (a.index !== lastIndex) {
      failed = true;
      break;
    }

    lastIndex = parseRegexp.lastIndex;

    const name = a[1];
    const value = a[2].trim();

    if (value === '') {
      throw new Error('Invalid style ' + name + ': value cannot be empty');
    }

    output.push({ name, value });
    failed = false;
  }

  if (failed) {
    throw new Error('Could not parse styles:\n' + style);
  }

  return output;
}

function setStyle(style: CSSStyleDeclaration, rule: StyleRule): boolean {
  style.removeProperty(rule.name);

  style.setProperty(rule.name, rule.value, '');

  return style.getPropertyValue(rule.name) !== '';
}

export interface IStyleMixin {
  setStyles(set: (rule: StyleRule) => boolean): boolean;
}

export class StyleMixin implements IStyleMixin {
  private styles: Array<IStyleMixin>;

  constructor(...styles: Array<IStyleMixin>) {
    this.styles = styles;
  }

  public setStyles(set: (rule: StyleRule) => boolean): boolean {
    return this.styles.every(x => x.setStyles(set));
  }
}

class StringMixin implements IStyleMixin {
  protected rules: Array<StyleRule>;

  constructor(style: string) {
    this.rules = parseStyle(style);
  }

  public setStyles(set: (rule: StyleRule) => boolean): boolean {
    return this.rules.every(set);
  }
}

export function css(
  template: TemplateStringsArray,
  ...args: Array<string>
): StringMixin {
  return new StringMixin(String.raw(template, ...args));
}

export class StyleGroup extends StringMixin implements IStyleMixin {
  public setStyles(set: (rule: StyleRule) => boolean): boolean {
    return this.rules.some(set);
  }
}

export class StyleSelector extends StyleMixin implements IStyleMixin {
  private rule: CSSStyleRule;

  constructor(selector: string, ...styles: Array<IStyleMixin>) {
    super(...styles);

    this.rule = makeStylesheet(selector);

    const failed: Array<StyleRule> = [];

    const style = this.rule.style;

    const set = (rule: StyleRule) => {
      const isOkay = setStyle(style, rule);

      if (!isOkay) {
        failed.push(rule);
      }

      return isOkay;
    };

    if (!this.setStyles(set)) {
      throw new Error(
        'Invalid styles:\n  ' +
          failed.map(x => x.name + ': ' + x.value).join('\n  ')
      );
    }
  }
}

let styleId = 0;

export class StyleClass extends StyleSelector implements IStyleMixin {
  public className: string;

  constructor(...styles: Array<IStyleMixin>) {
    const className = '__style_' + ++styleId + '__';

    super('.' + className, ...styles);

    this.className = className;
  }
}

export function classes(...names: Array<string>): string {
  if (names.length === 1) {
    return names[0];
  } else {
    return names.join(' ');
  }
}
