// jquery-3.3.1.js ( Slim Version )

import 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

declare var require: any;
/* let jQuery = require('./assets/js/jquery.js');
(<any>window).$ = jQuery;
(<any>window).jQuery = jQuery; */


// Summernote : Text Editor
let SummerNote = require('./assets/js/summernote-lite.js');
(<any>window).$.summernote = SummerNote;


// UiKit : UI component library like Bootstrap

// import UIkit from './assets/js/uikit';
// import Icons from './assets/js/uikit-icons';
// (<any>window).UIkit = UIkit;
// UIkit.use(Icons);

/* import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
(<any>window).hljs = hljs;
hljs.registerLanguage('javascript', javascript); */

