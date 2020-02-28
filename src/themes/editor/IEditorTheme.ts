// basic reference implementation
// TODO: full implementation
export default interface IEditorTheme {
  name: string; // theme name

  background: string; // default background CSS
  textColor: string; // default fore color

  uiLibThemeClassName: string; // Blueprint theme

  moduleBarBackground: string;

  headerBarBackground: string;
  headerTextColor: string;

  previewAreaBackground: string;

  propertyPanelBackground: string;
  propertyPanelGridColor: string;
  propertyPanelTextColor: string;
  propertyPanelAccentColor: string;

  propertyPanelItemHoverBackground: string;
  propertyPanelItemExpandedBackground: string;
}
