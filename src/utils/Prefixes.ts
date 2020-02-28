// http://shouldiprefix.com

import { StyleGroup, StyleMixin } from './Style';

//const alignStart = new StyleGroup(`
//  -webkit-align-items: flex-start;   /* Safari 6.1+. iOS 7.1+, BB10 */
//  -ms-flex-align: start;             /* IE 10 */
//  align-items: flex-start;           /* NEW, Spec - Firefox, Chrome, Opera */
//`);

const alignStretch = new StyleGroup(`
  -webkit-align-items: stretch;   /* Safari 6.1+. iOS 7.1+, BB10 */
  -ms-flex-align: stretch;        /* IE 10 */
  align-items: stretch;           /* NEW, Spec - Firefox, Chrome, Opera */
`);

//const justifyStart = new StyleGroup(`
//  -webkit-justify-content: flex-start;   /* Safari 6.1+. iOS 7.1+, BB10 */
//  -ms-flex-pack: start;                  /* IE 10 */
//  justify-content: flex-start;           /* NEW, Spec - Firefox, Chrome, Opera */
//`);

const justifyStretch = new StyleGroup(`
  -webkit-justify-content: stretch;   /* Safari 6.1+. iOS 7.1+, BB10 */
  -ms-flex-pack: stretch;             /* IE 10 */
  justify-content: stretch;           /* NEW, Spec - Firefox, Chrome, Opera */
`);

const flexbox = new StyleGroup(`
  display: -ms-flexbox;    /* TWEENER - IE 10 */
  display: -webkit-flex;   /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
  display: flex;           /* NEW, Spec - Firefox, Chrome, Opera */
`);

export const row = new StyleMixin(
  flexbox,
  justifyStretch,
  alignStretch,
  new StyleGroup(`
    -webkit-flex-direction: row;   /* Safari 6.1+. iOS 7.1+, BB10 */
    -ms-flex-direction: row;       /* IE 10 */
    flex-direction: row;           /* NEW, Spec - Firefox, Chrome, Opera */
  `)
);

export const column = new StyleMixin(
  flexbox,
  justifyStretch,
  alignStretch,
  new StyleGroup(`
    -webkit-flex-direction: column;   /* Safari 6.1+. iOS 7.1+, BB10 */
    -ms-flex-direction: column;       /* IE 10 */
    flex-direction: column;           /* NEW, Spec - Firefox, Chrome, Opera */
  `)
);

//export const center = new StyleGroup(`
//  -webkit-align-self: center;    /* Safari 6.1+. iOS 7.1+, BB10 */
//  -ms-flex-item-align: center;   /* IE 10 */
//  align-self: center;            /* NEW, Spec - Firefox, Chrome, Opera */
//`);

// This needs to set the flex-basis to 0px or else it won't work right
export const stretch = new StyleGroup(`
  -webkit-flex: 1 1 0px;   /* Safari 6.1+. iOS 7.1+, BB10 */
  -ms-flex: 1 1 0px;       /* IE 10 */
  flex: 1 1 0px;           /* NEW, Spec - Firefox, Chrome, Opera */
`);
