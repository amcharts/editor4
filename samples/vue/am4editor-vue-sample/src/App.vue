<template>
  <div id="app">
    <header>
      <div class="logo" @click.stop="menuSwitch('home')">
        <a href="#" @click.stop="menuSwitch('home')">amCharts 4 Editor Demo</a>
      </div>
    </header>

    <nav>
      <ul class="menu menu-primary">
        <li @click.stop="menuSwitch('new-chart')">
          <div class="menu-item-text"><a href="#" @click.stop="menuSwitch('new-chart')">New chart</a></div>
        </li>
        <li @click="menuSwitch">
          <div class="menu-item-text"><a href="#" @click.stop="menuSwitch('edit-chart')">Edit chart</a></div>
        </li>
        <li @click="menuSwitch">
          <div class="menu-item-text"><a href="#" @click.stop="menuSwitch('new-chart-from-data')">New chart from data</a></div>
        </li>
        <li @click="menuSwitch">
          <div class="menu-item-text"><a href="#" @click.stop="menuSwitch('edit-chart-type')">Edit chart type</a></div>
        </li>

      </ul>

      <ul class="menu menu-secondary">
        <li @click="menuSwitch('settings')">
          <div class="menu-item-text">Settings</div>
        </li>
      </ul>
    </nav>

    <main>
      <Home v-if="activePage === 'home'" />
      <NewChart v-else-if="activePage === 'new-chart'" 
        :launcher-settings="launcherSettings"
        :editor-config="editorConfig"
        />
      <EditChart v-else-if="activePage === 'edit-chart'" 
        :launcher-settings="launcherSettings"
        :editor-config="editorConfig"
        />
      <NewChartFromData v-else-if="activePage === 'new-chart-from-data'" 
        :launcher-settings="launcherSettings"
        :editor-config="editorConfig"
        />
      <EditChartType v-else-if="activePage === 'edit-chart-type'" 
        :launcher-settings="launcherSettings"
        :editor-config="editorConfig"
        />
      <Settings v-else-if="activePage === 'settings'" 
        :launcher-settings="launcherSettings" 
        :editor-config="editorConfig"
        :all-modules="allModules"
        :all-themes="allThemes"
        @toggle-module="toggleModules"
        @toggle-theme="toggleThemes"
        @set-target-type="setTargetType"
        @set-language="setLanguage"
        />
    </main>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Home from './components/Home.vue';
import NewChart from './components/NewChart.vue';
import EditChart from './components/EditChart.vue';
import NewChartFromData from './components/NewChartFromData.vue';
import EditChartType from './components/EditChartType.vue';
import Settings from './components/Settings.vue';
import * as am4editor from '@amcharts/editor4';

type PageType = 'home' | 'new-chart' | 'edit-chart' | 'new-from-data' | 'edit-type';

@Component({
  components: {
    Home, NewChart, EditChart, NewChartFromData, EditChartType, Settings
  },
})
export default class App extends Vue {
  private readonly allModules: am4editor.ModuleType[] = ['home', 'design', 'data', 'code'];
  private readonly allThemes: am4editor.IThemeInfo[] = [
    {
      name: 'am4themes_animated',
      label: 'Animated'
    },
    {
      name: 'am4themes_dark',
      label: 'Dark'
    }
  ];

  private launcherSettings: am4editor.ILauncherConfig = {
    editorUrl: '/am4editor/',
    target: { type: 'inline' }
  };
  private editorConfig: am4editor.IConfig = {
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

  private activePage: PageType = 'home';
  private menuSwitch(newPage: PageType) {
    this.activePage = newPage;
  }

  private toggleModules(name: am4editor.ModuleType, isEnabled: boolean) {
    const modules = this.editorConfig.enabledModules;
    if (modules) {
      if (!isEnabled && modules.indexOf(name) > -1) {
        modules.splice(modules.indexOf(name), 1);
      } else if ((isEnabled && modules.indexOf(name) === -1)) {
        modules.push(name);
      }
    }
  }

  private toggleThemes(name: string, isEnabled: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const themes = this.editorConfig!.engineConfig!.availableThemes;
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
  }

  private setTargetType(targetType: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.launcherSettings.target!.type = targetType === 'window' ? 'window' : 'inline';
  }

  private setLanguage(languagePack: am4editor.ITranslationPack) {
    this.editorConfig.language = languagePack;
  }
}
</script>

<style>
body, html, #app {
  height: 100%;
  height: 100vh;
  padding: 0px;
  margin: 0px;
}
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app {
  display: grid;
  grid-template-columns: [start] fit-content(300px) [contentstart] auto [end];
  grid-template-rows: [start] 48px [contentstart] auto [end];
}

header {
  width: 100%;
  height: 48px;
  background-color: #5249a9;
  grid-column: start / end;

  display: grid;
  align-items: center;
}

header .logo {
  text-align: center;
  color: #fff;
}

nav {
  grid-column: start / contentstart;
  grid-row: contentstart / end;
  width: 300px;
  background-color: #111;
  color: #ffffff;

  display: grid;
  grid-template-rows: [startmenu] fit-content() [startad] auto [endad] fit-content() [endmenu];
}

nav a {
  text-decoration: none;
  color: #ffffff;
}

nav > ul.menu {
  padding: 0px;
}
nav > ul.menu > li {
  min-height: 48px;
  cursor: pointer;
  user-select: none;
  
  border-left: 8px solid transparent;
}
nav > ul.menu > li:hover {
  border-left-color: #3cabff;
  background-color: #333;
}

nav > ul.menu .menu-item-text {
  min-height: 48px;
  display: grid;
  align-content: center;
  padding-left: 12px;
}

nav > ul.menu-primary {
  grid-row: 1;
}
nav> ul.menu-secondary {
  grid-row: 3;
  align-self: end;
  padding-top: 8px;
  border-top: 1px solid #333;
}

main {
  grid-column: contentstart / end;
  grid-row: contentstart / end;
  background-color: #fff;
  overflow-y: scroll;
  padding: 10px 30px;
}

.launch-editor-button {
  background-color: #3cabff;
  color: white;
  padding: 5px 10px;
  font-size: 1.2em;
  border: 2px solid #3cabff;
}
.launch-editor-button:hover {
  border-color: #5249a9;
}
.launch-editor-button:active {
  border-color: #5249a9;
  background-color: #5249a9;
}
.chartdiv {
  height: 500px;
  border: 2px solid #efefef;
  padding: 20px;
  display: grid;
}
.chartdiv .placeholder {
  background-color: #efefef;
  color: #888;
  display: grid;
  align-items: center;
  justify-items: center;
  cursor: pointer;
}
code {
  background-color: #efefef;
}

.logo a {
  color: white;
}
</style>
