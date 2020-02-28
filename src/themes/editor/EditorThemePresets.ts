import IEditorTheme from './IEditorTheme';

const defaultTheme: IEditorTheme = {
  name: 'default',

  uiLibThemeClassName: 'bp3-dark',

  background: 'white',
  textColor: '#444444',

  moduleBarBackground: '#505771',

  headerBarBackground: '#2d232e',
  headerTextColor: '#ffffff',

  previewAreaBackground: '#F6F6F7',

  propertyPanelBackground: '#535364',
  propertyPanelGridColor: 'rgba(0,0,0,.1)',
  propertyPanelTextColor: '#333',
  propertyPanelAccentColor: '#8CA9D4',
  propertyPanelItemHoverBackground: 'rgba(116,116,130,.3)',
  propertyPanelItemExpandedBackground: '#464654'
};

const lightTheme: IEditorTheme = {
  name: 'light',

  uiLibThemeClassName: 'bp3-light',

  background: 'white',
  textColor: 'black',

  moduleBarBackground: 'grey',

  headerBarBackground: 'lightgrey',
  headerTextColor: 'darkgrey',

  previewAreaBackground: 'white',

  propertyPanelBackground: 'grey',
  propertyPanelGridColor: 'grey',
  propertyPanelTextColor: 'black',
  propertyPanelAccentColor: '#8CA9D4',
  propertyPanelItemHoverBackground: 'rgba(116,116,130,.3)',
  propertyPanelItemExpandedBackground: '#464654'
};

export default [defaultTheme, lightTheme];
