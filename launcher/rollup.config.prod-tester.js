import commoncfg from './rollup.config.common';
import copy from 'rollup-plugin-cpy';
import staticSite from 'rollup-plugin-static-site';

commoncfg[0].plugins.push(
  staticSite({
    template: { path: 'src/dev-assets/template.html' },
    dir: 'dist'
  }),
  copy({
    files: ['src/dev-assets/*.js'],
    dest: 'dist'
  })
);

export default commoncfg;
