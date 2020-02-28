import IPropertyGroup from './IPropertyGroup';

/**
 * Returns built-in property groups
 *
 * @export
 * @class PropertyGroupFactory
 */
export default class PropertyGroupFactory {
  public static getDefaultPropertyGroupSet(): IPropertyGroup[] {
    return [
      {
        name: 'main',
        displayName: 'Main',
        orderno: 10
      },
      {
        name: 'a11y',
        displayName: 'Accessibility',
        orderno: 50
      },
      {
        name: 'interactivity',
        displayName: 'Interactivity',
        orderno: 40
      },
      {
        name: 'behavior',
        displayName: 'Behavior',
        orderno: 30
      },
      {
        name: 'data',
        displayName: 'Data',
        orderno: 20
      },
      {
        name: 'misc',
        displayName: 'Other',
        orderno: Number.MAX_SAFE_INTEGER
      },

      {
        name: 'layout',
        displayName: 'Layout & positioning',
        orderno: 24
      },
      {
        name: 'appearance',
        displayName: 'Appearance',
        orderno: 27
      },
      {
        name: 'misc-styles',
        displayName: 'Misc',
        orderno: Number.MAX_SAFE_INTEGER
      }
    ].sort((a, b) => (a.orderno > b.orderno ? 1 : -1));
  }

  public static getDefaultPropertyGroupNames(): string[] {
    const groupSet = PropertyGroupFactory.getDefaultPropertyGroupSet();
    const result = new Array<string>();
    result.push(...groupSet.map(g => g.name));

    return result;
  }
}
