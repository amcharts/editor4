import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as am4editor from '@amcharts/editor4';

export interface TargetChangedEvent {
    target: string;
}

export interface ModuleToggledEvent {
    name: am4editor.ModuleType;
    isEnabled: boolean;
}

export interface ThemeToggledEvent {
    name: string;
    isEnabled: boolean;
}

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
    @Input() allModules: Array<am4editor.ModuleType>;
    @Input() allThemes: Array<am4editor.IThemeInfo>;
    @Input() launcherSettings: am4editor.ILauncherConfig;
    @Input() editorConfig: am4editor.IConfig;

    @Output() onTargetChanged = new EventEmitter<TargetChangedEvent>();
    @Output() onModuleToggled = new EventEmitter<ModuleToggledEvent>();
    @Output() onThemeToggled = new EventEmitter<ThemeToggledEvent>();

    public toggleModule(name: am4editor.ModuleType, isEnabled: boolean) {
        this.onModuleToggled.emit({ name, isEnabled });
    }

    public toggleTheme(name: string, isEnabled: boolean) {
        this.onThemeToggled.emit({ name, isEnabled });
    }

    public setTargetType(target: string) {
        this.onTargetChanged.emit({ target });
    }

    public isModuleChecked(name: am4editor.ModuleType): boolean {
        return this.editorConfig.enabledModules.indexOf(name) > -1;
    }

    public isThemeChecked(theme: string): boolean {
        return this.editorConfig.engineConfig.availableThemes.find(t => t.name === theme) !== undefined;
    }

    public themeKey(theme: am4editor.IThemeInfo): string {
        return `theme-${theme.name}`;
    }
}
