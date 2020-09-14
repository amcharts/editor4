/* eslint-disable no-console */

import * as fs from 'fs';
import * as jsbeautifier from 'js-beautify';

import en from '../../src/utils/lang/en/en';

/* eslint-disable @typescript-eslint/camelcase */
const beatifyOptions: JsBeautifyOptions = {
  jslint_happy: true
};
/* eslint-enable @typescript-eslint/camelcase */

const beatifiedEn = jsbeautifier.js_beautify(
  JSON.stringify(en),
  beatifyOptions
);

fs.writeFileSync(
  './../../public/lang/en/en.esm.js',
  `/* eslint-disable */
export default ${beatifiedEn}`,
  'utf8'
);

fs.writeFileSync(
  './../../public/lang/en/en.js',
  `/* eslint-disable */
  window.am4editor_lang_en = ${beatifiedEn}`,
  'utf8'
);

console.log('done');
