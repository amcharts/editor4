import pkg from './package.json';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import generatePackageJson from 'rollup-plugin-generate-package-json';

const outputDir = './dist/';

const leanPkg = Object.assign({}, pkg);
leanPkg.scripts = {};
leanPkg.devDependencies = {};

const banner = `/* **********************************
amCharts 4 Editor version ${pkg.version}
https://www.amcharts.com

copyright amCharts
see README.md and LICENSE for details
********************************** */`;

export default [
  {
    input: 'src/index.ts',
    plugins: [
      del({ targets: 'dist/*' }),
      typescript({
        clean: true,
        useTsconfigDeclarationDir: true
      }),
      generatePackageJson({
        baseContents: leanPkg
      })
    ],
    output: [
      {
        file: outputDir + pkg.module,
        format: 'es',
        banner: banner
      },
      {
        file: outputDir + pkg.main,
        name: 'am4editor',
        format: 'umd',
        sourcemap: true,
        banner: banner
      }
    ]
  }
];
