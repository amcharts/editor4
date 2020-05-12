import * as AdmZip from 'adm-zip';
import * as pkg from '../../package.json';

const zip = new AdmZip();

zip.addLocalFolder(`${__dirname}/../../launcher/dist`);
zip.writeZip(`${__dirname}/releases/am4editor-${pkg.version}.zip`);
