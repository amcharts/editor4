<template>
  <div class="settings">
    <h1>General Launcher/Editor settings</h1>
    <p>
      <b>Modify settings used as the basis for all demos.</b>
    </p>
    <p>Note: these are just a few of available settings used here for demo purposes.</p>

    <h2>Launch Editor in...</h2>
    <label>
      <input type="radio" name="target-type" value="inline" 
        :checked="launcherSettings.target.type === 'inline'"
        @change="setTargetType($event.target.value)"
      />
      iframe (inline)
    </label>
    <label>
      <input type="radio" name="target-type" value="window" 
        :checked="launcherSettings.target.type === 'window'"
        @change="setTargetType($event.target.value)"
      />
      window
    </label>

    <h2>Enabled modules</h2>
    <label v-for="item in allModules" :key="item">
      <input type="checkbox" 
        :value="item" 
        :checked="editorConfig.enabledModules.indexOf(item) > -1"
        @change="toggleModule($event.target.value, $event.target.checked)"
      />
      {{ item }}
    </label>

    <h2>Available themes</h2>
    <label v-for="theme in allThemes" :key="`theme-${theme.name}`">
      <input type="checkbox" 
        :value="theme.name" 
        :checked="editorConfig.engineConfig.availableThemes.find(t => t.name === theme.name) !== undefined"
        @change="toggleTheme($event.target.value, $event.target.checked)"
      />
      {{ theme.label }}
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// import Editor Launcher
import * as am4editor from '@amcharts/editor4';

@Component
export default class Settings extends Vue {
  @Prop() allModules!: am4editor.ModuleType[];
  @Prop() allThemes!: am4editor.IThemeInfo[];
  @Prop() launcherSettings!: am4editor.ILauncherConfig;
  @Prop() editorConfig!: am4editor.IConfig;

  private toggleModule(name: string, isEnabled: boolean) {
    this.$emit('toggle-module', name, isEnabled);
  }

  private toggleTheme(name: string, isEnabled: boolean) {
    this.$emit('toggle-theme', name, isEnabled);
  }

  private setTargetType(targetType: string) {
    this.$emit('set-target-type', targetType);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
