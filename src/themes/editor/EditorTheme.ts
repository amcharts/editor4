import presetThemes from './EditorThemePresets';
import IEditorTheme from './IEditorTheme';

/**
 * Editor theme factory class.
 *
 * @class EditorTheme
 */
class EditorTheme {
  /**
   * Returns preset theme by name or default theme, when name is not provided.
   *
   * @static
   * @param {string} [presetName]
   * @returns {IEditorTheme}
   */
  public static getTheme(presetName?: string): IEditorTheme {
    if (presetName) {
      return (
        EditorTheme.getPresetTheme(presetName) || EditorTheme.getDefaultTheme()
      );
    } else {
      return EditorTheme.getDefaultTheme();
    }
  }

  /**
   * Returns preset theme by name.
   *
   * @static
   * @param {string} name
   * @returns {(IEditorTheme | undefined)}
   */
  public static getPresetTheme(name: string): IEditorTheme | undefined {
    return presetThemes.find(el => el.name === name);
  }

  /**
   * Returns default theme.
   *
   * @static
   * @returns {IEditorTheme}
   */
  public static getDefaultTheme(): IEditorTheme {
    return presetThemes[0];
  }
}

export default EditorTheme.getTheme();
