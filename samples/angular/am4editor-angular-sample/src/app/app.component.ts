import { Component } from '@angular/core';
import { TargetChangedEvent, ModuleToggledEvent, ThemeToggledEvent } from './settings/settings.component';
import * as am4editor from '@amcharts/editor4';

type PageType = 'home' | 'new-chart' | 'edit-chart' | 'new-chart-from-data' | 'edit-chart-type' | 'settings';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public readonly allModules: Array<am4editor.ModuleType> = ['home', 'design', 'data', 'code'];
    public readonly allThemes: Array<am4editor.IThemeInfo> = [
        {
            name: 'am4themes_animated',
            label: 'Animated'
        },
        {
            name: 'am4themes_dark',
            label: 'Dark'
        }
    ];

    public launcherSettings: am4editor.ILauncherConfig = {
        editorUrl: '/assets/am4editor/',
        target: { type: 'inline' }
    };
    public editorConfig: am4editor.IConfig = {
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
    };

    public activePage: PageType = 'home';

    public menuSwitch(newPage: PageType) {
        this.activePage = newPage;
    }

    public setTargetType(event: TargetChangedEvent) {
        this.launcherSettings.target.type = event.target === 'window' ? 'window' : 'inline';
    }

    public toggleModule(event: ModuleToggledEvent) {
        const modules = this.editorConfig.enabledModules;
        if (modules) {
            if (!event.isEnabled && modules.indexOf(event.name) > -1) {
                modules.splice(modules.indexOf(event.name), 1);
            } else if ((event.isEnabled && modules.indexOf(event.name) === -1)) {
                modules.push(event.name);
            }
        }
    }

    public toggleTheme(event: ThemeToggledEvent) {
        const themes = this.editorConfig.engineConfig.availableThemes;
        if (themes) {
            if (!event.isEnabled && themes.findIndex(t => t.name === event.name) > -1) {
                themes.splice(themes.findIndex(t => t.name === event.name), 1);
            } else if ((event.isEnabled && themes.findIndex(t => t.name === event.name) === -1)) {
                const theme = this.allThemes.find(t => t.name === event.name)
                if (theme) {
                    themes.push(theme);
                }
            }
        }
    }
}
