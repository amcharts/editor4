import * as fs from 'fs';
import * as pkg from './../../package.json';

const PATHROOT = `${__dirname}/../../src/classes/`;

const versionFile = fs.openSync(`${PATHROOT}Version.ts`, 'w');
fs.writeSync(
  versionFile,
  `export default class Version {
  public static getVersion(): string {
    return '${pkg.version}';
  }
}
`
);
fs.closeSync(versionFile);
