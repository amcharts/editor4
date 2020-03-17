import React, { Component } from "react";

class Settings extends Component {
  setTargetType(target) {
    if (this.props.onTargetChanged) {
      this.props.onTargetChanged(target);
    }
  }

  toggleModule(name, isEnabled) {
    if (this.props.onModuleToggled) {
      this.props.onModuleToggled(name, isEnabled);
    }
  }

  toggleTheme(name, isEnabled) {
    if (this.props.onThemeToggled) {
      this.props.onThemeToggled(name, isEnabled);
    }
  }

  render() {
    return (
      <div className="settings">
        <h1>General Launcher/Editor settings</h1>
        <p>
          <b>Modify settings used as the basis for all demos.</b>
        </p>
        <p>Note: these are just a few of available settings used here for demo purposes.</p>

        <h2>Launch Editor in...</h2>
        <label>
          <input type="radio" name="target-type" value="inline" 
            checked={this.props.launcherSettings.target.type === 'inline'}
            onChange={(event) => this.setTargetType(event.target.value)}
          />
          iframe (inline)
        </label>
        <label>
          <input type="radio" name="target-type" value="window" 
            checked={this.props.launcherSettings.target.type === 'window'}
            onChange={(event) => this.setTargetType(event.target.value)}
          />
          window
        </label>

        <h2>Enabled modules</h2>
        {this.props.allModules.map((module, index) => (
          <label key={`module-${index}`}>
            <input type="checkbox" value={module}
              checked={this.props.launcherSettings.editorConfig.enabledModules.indexOf(module) > -1}
              onChange={(event) => this.toggleModule(event.target.value, event.target.checked)}
              />
            {module}
          </label>
        ))}

        <h2>Available themes</h2>
        {this.props.allThemes.map((theme, index) => (
          <label key={`theme-${index}`}>
            <input type="checkbox" value={theme.name} 
              checked={this.props.launcherSettings.editorConfig.engineConfig.availableThemes.find(t => t.name === theme.name) !== undefined}
              onChange={(event) => this.toggleTheme(event.target.value, event.target.checked)}
              />
            {theme.label}
          </label>
        ))}
      </div>
    )
  }
}

export default Settings