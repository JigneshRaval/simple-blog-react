// jquery-3.3.1.js
let jQuery = require('./assets/js/jquery.js');
(<any>window).$ = jQuery;
(<any>window).jQuery = jQuery;


let SummerNote = require('./assets/js/summernote-lite.js');
(<any>window).$.SummerNote = SummerNote;

let SummerNote = require('./assets/js/summernote-lite.js');

import UIkit from './assets/js/uikit';
import Icons from './assets/js/uikit-icons';
(<any>window).UIkit = UIkit;
UIkit.use(Icons);
UIkit.notification('Hello world.');
