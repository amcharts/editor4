import React, { Component } from 'react';
import './App.css';

import Home from './Home';
import NewChart from './NewChart';
import Settings from './Settings';
import EditChart from './EditChart';
import NewChartFromData from './NewChartFromData';
import EditChartType from './EditChartType';

class App extends Component {
  allModules = ['home', 'design', 'data', 'code'];
  allThemes = [
    {
      name: 'am4themes_animated',
      label: 'Animated'
    },
    {
      name: 'am4themes_dark',
      label: 'Dark'
    }
  ];

 
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'home',
      launcherSettings: {
        editorUrl: '/am4editor/',
        target: { type: 'inline' }
      },
      editorConfig: {
        enabledModules: ['home', 'design', 'data', 'code'],
        engineConfig: {
          availableThemes: [
            {
              name: 'am4themes_animated',
              label: 'Animated'
            },
            {
              name: 'am4themes_dark',
              label: 'Dark'
            }
          ]
        }
      }
    }

    this.menuSwitch = this.menuSwitch.bind(this);
    this.setTargetType = this.setTargetType.bind(this);
    this.toggleModule = this.toggleModule.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
    this.setLanguage = this.setLanguage.bind(this);
  }

  menuSwitch(page) {
    this.setState( { currentPage: page } );
  }

  setTargetType(target) {
    const newState = Object.assign({}, this.state.launcherSettings);
    newState.target.type = target;

    this.setState( { launcherSettings: newState } );
  }

  toggleModule(name, isEnabled) {
    const newState = Object.assign({}, this.state.editorConfig);
    const modules = newState.enabledModules;
    if (modules) {
      if (!isEnabled && modules.indexOf(name) > -1) {
        modules.splice(modules.indexOf(name), 1);
      } else if ((isEnabled && modules.indexOf(name) === -1)) {
        modules.push(name);
      }
    }
    this.setState( { editorConfig: newState } );
  }

  toggleTheme(name, isEnabled) {
    const newState = Object.assign({}, this.state.editorConfig);
    const themes = newState.engineConfig.availableThemes;
    if (themes) {
      if (!isEnabled && themes.findIndex(t => t.name === name) > -1) {
        themes.splice(themes.findIndex(t => t.name === name), 1);
      } else if ((isEnabled && themes.findIndex(t => t.name === name) === -1)) {
        const theme = this.allThemes.find(t => t.name === name)
        if (theme) {
          themes.push(theme);
        }
      }
    }
    this.setState( { editorConfig: newState } );
  }

  setLanguage(languagePack) {
    const newState = Object.assign({}, this.state.editorConfig);
    newState.language = languagePack;
    this.setState( { editorConfig: newState} );
  }

  render() {
    return (
      <div className="App">
        <header>
          <div className="logo" onClick={() => this.menuSwitch('home')}>
            <a href="#home" onClick={() => this.menuSwitch('home')}>amCharts 4 Editor Demo</a>
          </div>
        </header>

        <nav>
          <ul className="menu menu-primary">
            <li onClick={() => this.menuSwitch('new-chart')}>
              <div className="menu-item-text">
                <a href="#new-chart" onClick={() => this.menuSwitch('new-chart')}
                  >New chart</a>
              </div>
            </li>
            <li onClick={() => this.menuSwitch('edit-chart')}>
              <div className="menu-item-text">
                <a href="#edit-chart" onClick={() => this.menuSwitch('edit-chart')}
                  >Edit chart</a></div>
            </li>
            <li onClick={() => this.menuSwitch('new-chart-from-data')}>
              <div className="menu-item-text">
                <a href="#new-chart-from-data" onClick={() => this.menuSwitch('new-chart-from-data')}
                >New chart from data</a></div>
            </li>
            <li onClick={() => this.menuSwitch('edit-chart-type')}>
              <div className="menu-item-text">
                <a href="#edit-chart-type" onClick={() => this.menuSwitch('edit-chart-type')}
                  >Edit chart type</a></div>
            </li>

          </ul>

          <ul className="menu menu-secondary">
            <li onClick={() => this.menuSwitch('settings')}>
              <div className="menu-item-text">Settings</div>
            </li>
          </ul>
        </nav>

        <main>
          {this.state.currentPage === 'home' && <Home />}

          {this.state.currentPage === 'new-chart' && 
            <NewChart 
              launcherSettings={this.state.launcherSettings} 
              editorConfig={this.state.editorConfig}
            />
          }
          {this.state.currentPage === 'edit-chart' && 
            <EditChart 
              launcherSettings={this.state.launcherSettings} 
              editorConfig={this.state.editorConfig}
            />
          }
          {this.state.currentPage === 'new-chart-from-data' && 
            <NewChartFromData 
              launcherSettings={this.state.launcherSettings} 
              editorConfig={this.state.editorConfig}
            />
          }
          {this.state.currentPage === 'edit-chart-type' && 
            <EditChartType
              launcherSettings={this.state.launcherSettings} 
              editorConfig={this.state.editorConfig}
            />
          }
          {this.state.currentPage === 'settings' && 
            <Settings 
              launcherSettings={this.state.launcherSettings} 
              editorConfig={this.state.editorConfig}
              allModules={this.allModules} 
              allThemes={this.allThemes} 
              onTargetChanged={this.setTargetType}
              onModuleToggled={this.toggleModule}
              onThemeToggled={this.toggleTheme}
              onLanguageChanged={this.setLanguage}
            />
          }
        </main>

      </div>
    );
  }
}

export default App;
