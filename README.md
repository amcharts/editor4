# amCharts 4 Editor

amCharts 4 Editor is a chart configuration creation and editing GUI for [amCharts 4](https://amcharts.com).
It is intended to be used as part of your application to enable your users to create and edit chart configurations.

## Installation

There are two steps that you need to complete to add amCharts 4 Editor to your CMS.

### 1. Install the package:

```
npm install @amcharts4/editor4
```

or 

```
yarn add @amcharts/editor4
```

### 2. Configure your build process to copy `am4editor` directory inside of this package into the output of your build.

For example, you can use a tool like [ncp](https://www.npmjs.com/package/ncp) to copy these files into the `public` 
directory of your projects. An included [React demo](https://github.com/amcharts/editor4/tree/master/samples/react/am4editor-react-sample)
uses this technique in a typical [Create React App](https://github.com/facebook/create-react-app)-based application:

Standard CRA scripts in `package.json` are modified to perform the copying before the build:

```json
"scripts": {
    "copy-editor": "ncp ./node_modules/@amcharts/editor4/am4editor ./public/am4editor",
    "start": "yarn copy-editor && react-scripts start",
    "build": " yarn copy-editor && react-scripts build",
}
```

[Vue sample](https://github.com/amcharts/editor4/tree/master/samples/vue/am4editor-vue-sample), on the other hand, uses a different approach and [modifies webpack configuration](https://github.com/amcharts/editor4/blob/master/samples/vue/am4editor-vue-sample/vue.config.js) to perform the copy.

## Usage

First, you'll need to import Editor launcher into your app like this:

```javascript
// import Editor Launcher
import * as am4editor from '@amcharts/editor4';
```

Then you create an instance of the `EditorLauncher` class and call its `launch()`
method passing chart configuration object in case you want to edit an existing chart. 

Something like this:

```javascript
const launcher = new am4editor.EditorLauncher();
launcher.launch(chartConfig);
```

Refer to [EditorLauncher reference](https://www.amcharts.com/docs/editor4/reference/editorlauncher/) 
in the documentation to learn about available properties and configuration options.

### Samples

For practical applications, check out the included samples:

- [Vanilla JavaScript](https://github.com/amcharts/editor4/tree/master/samples/javascript/)
- [React](https://github.com/amcharts/editor4/tree/master/samples/react/)
- [Vue](https://github.com/amcharts/editor4/tree/master/samples/vue/)
- [Angular](https://github.com/amcharts/editor4/tree/master/samples/angular/)

## Support

Commercial license holders should contact us directly at [contact@amcharts.com](mailto:contact@amcharts.com).

## License

If you have a commercial amCharts 4 Editor license, this software is covered by your
license, which supersedes any other license bundled with this package.

If you don't have a commercial license, you can use this software for development and testing purposes. Refer to the included LICENSE file. The license is also
[available online](https://github.com/amcharts/editor4/blob/master/LICENSE).

## Questions?

[Contact amCharts](mailto:contact@amcharts.com).


## Found a bug?

Open an [issue](https://github.com/amcharts/editor4/issues).
