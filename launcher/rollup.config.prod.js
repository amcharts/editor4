import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-cpy';
import dts from 'rollup-plugin-dts';

import commoncfg from './rollup.config.common';

commoncfg[0].plugins.push(
  terser(),
  copy([
    {
      files: ['../LICENSE', '../README.md'],
      dest: 'dist'
    },
    {
      files: 'am4editor/**',
      dest: 'dist',
      options: {
        parents: true
      }
    }
  ])
);

commoncfg.push({
  input: './dts/launcher/src/index.d.ts',
  output: [{ file: 'dist/editor-launcher.d.ts', format: 'es' }],
  plugins: [dts()]
});

export default commoncfg;
