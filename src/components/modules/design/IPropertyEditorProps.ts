import Property from '../../../classes/Property';
import IBaseProps from '../../core/IBaseProps';

export default interface IPropertyEditorProps extends IBaseProps {
  property: Property;
  isExpanded?: boolean;
  onExpandedChange?: (propertyName: string) => void;
}
