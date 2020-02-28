import Property from '../../classes/Property';
import IValueType from '../../classes/IValueType';
import EditorState from './EditorState';

/**
 * Base props for chart editor
 *
 * @export
 * @interface IBaseProps
 */
export default interface IBaseProps {
  editorState: EditorState;

  /**
   * Handle changes of current property (property tree navigation)
   *
   */
  onCurrentPropertyChange?: (
    property: Property,
    ...pathProperties: Property[]
  ) => void;

  /**
   * Handle property value changes and resets
   *
   */
  onPropertyValueChange?: (
    property: Property,
    options: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newValue?: any;
      resetToOriginal?: boolean;
      resetToDefault?: boolean;
    }
  ) => void;

  /**
   * Handle removal of elements from List-type properties
   *
   */
  onRemoveListItem?: (property: Property, listItem: Property) => void;

  /**
   * Add item to List-type property
   *
   */
  onAddListItem?: (
    property: Property,
    itemType: IValueType,
    forTemplate?: boolean,
    itemName?: string
  ) => void;

  /**
   * Add object item value
   *
   */
  onNewObjectItemValue?: (property: Property, itemType?: IValueType) => void;

  onThemeChange?: (themes: {
    addThemeName?: string;
    removeThemeName?: string;
  }) => void;

  onLicensesChange?: (licenses?: string[]) => void;
}
