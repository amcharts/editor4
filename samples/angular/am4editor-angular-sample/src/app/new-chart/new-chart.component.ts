import { Input, Component } from '@angular/core';
// import amCharts
import * as am4core from '@amcharts/amcharts4/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as am4charts from '@amcharts/amcharts4/charts';
import '@amcharts/amcharts4/charts'; // "hack" to prevent charts from being optimized-out as unused
// import themes
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
// eslint-disable-next-line @typescript-eslint/camelcase
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

// import Editor Launcher
import * as am4editor from '@amcharts/editor4';

@Component({
  selector: 'app-new-chart',
  templateUrl: './new-chart.component.html',
  styleUrls: ['./new-chart.component.css']
})
export class NewChartComponent {
    chart?: am4core.Sprite;
    launcher?: am4editor.EditorLauncher;
    previewBackgroundColor = 'white';

    @Input() launcherSettings: am4editor.ILauncherConfig;
    @Input() editorConfig: am4editor.IConfig;

    launchEditor() {
        this.launcher = new am4editor.EditorLauncher(this.launcherSettings);

        this.launcher.addEventListener('save', this.renderChart);
        this.launcher.addEventListener('close', () => {
            if (this.launcher) {
                this.launcher.close();
            }
        });

        // create a copy of global editor config so we don't modify it everywhere
        const editorConfig: am4editor.IConfig = JSON.parse(JSON.stringify(this.editorConfig));
        editorConfig.allowDefaultTemplates = true;
        this.launcher.editorConfig = editorConfig;

        this.launcher.launch();
    }

    renderChart(event?: am4editor.ILauncherEventArguments) {
        if (event) {
            if (this.launcher) {
                this.launcher.close();
            }

            if (event.appliedThemes) {
                this.applyChartThemes(event.appliedThemes);
            }

            if (this.chart !== undefined) {
                this.chart.dispose();
            }

            this.chart = am4core.createFromConfig(event.chartConfig, "chartdiv-new");
        }
    }

    applyChartThemes(themes: Array<string>) {
        am4core.unuseAllThemes();

        // just a sampling of applying a couple of themes
        if (themes) {
            themes.forEach(t => {
                switch (t) {
                    case 'am4themes_animated': {
                        am4core.useTheme(am4themes_animated);
                        break;
                    }
                    case 'am4themes_dark': {
                        am4core.useTheme(am4themes_dark);
                        break;
                    }
                }
            });
        }

        // get background color from applied themes
        const interfaceColors = new am4core.InterfaceColorSet();
        this.previewBackgroundColor = interfaceColors.getFor('background').hex;
    }

    ngOnDestroy() {
        if (this.chart !== undefined) {
            // cleanup after ourselves
            this.chart.dispose();
        }
    }
}
