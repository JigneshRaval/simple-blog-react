const LOCAL_JS_PATH = '';

const APP_ROOT = '<div id="root"></div>';

// CDN path : <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" crossorigin="anonymous"></script>
const JQUERY = '<script src="./js/jquery.min.js"><\/script>';

// CDN path : <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossorigin="anonymous">
const BOOTSTRAP_CSS = '<link rel="stylesheet" href="./css/bootstrap.min.css" />';

// CDN path : <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" crossorigin="anonymous"></script>
// <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" crossorigin="anonymous"></script>
const BOOTSTRAP_JS = '<script src="./js/bootstrap.bundle.min.js"><\/script>';

const HANDLEBARS = '<script src="./js/handlebars/handlebars-v4.4.3.js"><\/script>';

const REQUIRE_METHOD = `
<script id="require_method" type="text/javascript">
    function require(module) {
        if (module === "react") return React;
        if (module === "react-dom") return ReactDOM;
        if (module === "react-router-dom") return ReactRouterDOM;
        if (module === "rxjs") return rxjs; // RxJS 5.x
        if (module === "RxJs") return Rx;   // RxJS 6.x
    }
</script>
`;

const BABEL = `
<script src="./js/babel/babel.min.js" type="text/javascript"></script>
`;

// CDN path : https://unpkg.com/@babel/preset-env-standalone@7.7.3/babel-preset-env.min.js
const BABEL_PRESET_ENV = '<script src="./js/babel/babel-preset-env.js"><\/script>';

// CDN path : https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/5.1.2/react-router-dom.js
const REACT = `
<script src="./js/react/react.development.js" type="text/javascript"></script>
<script src="./js/react/react-dom.development.js" type="text/javascript"></script>
<script src="./js/react/react-router-dom.js" type="text/javascript"></script>
`;

const VUEJS = `
<script src="https://unpkg.com/vue@2.6.10/dist/vue.js"><\/script>
<script src="https://unpkg.com/vue-router@3.1.3/dist/vue-router.js"><\/script>
`;

const SCSS = '<script src="./js/sass/sass.js"><\/script>';

const RXJS_5 = '<script src="https://unpkg.com/@reactivex/rxjs@5.5.6/dist/global/Rx.js"><\/script>';

const RXJS_6 = '<script src="https://unpkg.com/rxjs@6.5.3/bundles/rxjs.umd.js"><\/script>';

const rxjsOutputStyle = `<style> body { background-color: #eeeeee; } .example { margin-bottom: 1em; } .observable-output { list-style-type: none; margin: 0; padding: 0; } .observable-output li { padding: 1em; margin-bottom: 1em; border: 1px solid #CCC; background-color: #ffffff; box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1); } .observable-output .bg-success { box-shadow: 0 5px 5px rgba(40, 167, 69, 0.4); } .observable-output .bg-danger { box-shadow: 0 5px 5px rgba(220, 53, 69, 0.4); } </style>`;

const rxjsOutputScript = `
<script>
    var dangerClass = 'border border-danger bg-danger text-white';
    var successClass = 'border border-success bg-success text-white';
    function addItem(val, outputContainer, cssClass) {
        let listWrapper = document.createElement('ul');
        listWrapper.className = 'observable-output';
        listWrapper.id = Math.random();
        var node = document.createElement("li");
        var textNode = document.createTextNode(val);
        node.appendChild(textNode);
        // outputContainer ? document.querySelector(outputContainer).appendChild(node) : document.body.appendChild(listWrapper);;
        // document.querySelector(outputContainer).appendChild(node);
        listWrapper.appendChild(node);
        document.body.appendChild(listWrapper);
        if (cssClass) {
            if (node) {
                node.className = cssClass;
            }
        }
    }
<\/script>`;

const CODEMIRROR_CONTENT = `
<!-- HTML Code -->
<h1>Code Example</h1>
<div id="msg"></div>

<!-- CSS Code -->
<style>
/* Your CSS code */
</style>

<!-- JavaScript Code -->
<script type="text/babel">
// your JavaScript logic
</script>
`

export default class Editor {

    constructor() {
        this.timer;
        this.editorData = '';
        this._template = 'JavaScript';
        this.previewFrame = document.getElementById('preview');
        this.preview = this.previewFrame.contentDocument || this.previewFrame.contentWindow.document;
        this.textArea = document.getElementById('code');
        this.codeMirror;
    }

    init() {
        // Babel.registerPlugin('babelPresetEnv', babelPresetEnv);
        this.initCodeMirror();
        this.getCodeExamples();
        // this.renderOutput(documentContents);

        // Bind event listener with text area
        /* this.textArea.addEventListener('input', (event) => {
            this.editorData = editor1.getValue() || event.target.value || event.target.innerText;
            console.log('this.editorData :', this.editorData);
            clearInterval(this.timer);

            this.timer = setInterval(() => {
                this.createApp(this.editorData);
                // let block = document.querySelector('textarea') || document.querySelector('pre');
                // hljs.highlightBlock(block);
            }, 1000);
        }); */
    }

    /**
     * Initialize CodeMirror Editor
     */
    initCodeMirror() {
        let editorArea = document.getElementById('code');
        this.codeMirror = CodeMirror.fromTextArea(editorArea, {
            lineNumbers: true,
            lineWrapping: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
            mode: "text/html",
            theme: 'tomorrow-night-bright',
            value: "function myScript(){return 100;}\n",
        });

        // Set default content in CodeMirror editor
        this.codeMirror.getDoc().setValue(CODEMIRROR_CONTENT);

        // Bind event listener with text area
        this.codeMirror.on("change", (event) => {
            this.editorData = this.codeMirror && this.codeMirror.getValue() || event.target && event.target.value || event.target && event.target.innerText;
            clearInterval(this.timer);

            this.timer = setInterval(() => {
                this.createApp(this.editorData);
            }, 1000);
        });
    }

    /**
     * Set template name
     * @param {*} event
     */
    setTemplate(event) {
        this.resetEditor();
        this._template = event.target.parentNode.children[1].value || event.target.children[1].value;
        localStorage.setItem('editorTemplateName', this._template);

        let codeMirrorContent = document.querySelector(`.code-example-wrapper #${this._template} pre code`).innerText;
        // Set default content in CodeMirror editor
        this.codeMirror.getDoc().setValue(codeMirrorContent || CODEMIRROR_CONTENT);
    }

    getTemplate() {
        this._template = localStorage.getItem('editorTemplateName');;
        return this._template;
    }

    createApp(editorData) {
        let scriptBlocks = JQUERY + BOOTSTRAP_CSS + BOOTSTRAP_JS + REQUIRE_METHOD + BABEL + BABEL_PRESET_ENV;

        if (this._template === 'SCSS') {
            sass.compile(editorData, (result) => {
                editorData = '<pre>' + result.text + '</pre>';
                console.log(result.text, editorData);
                this.preview.open();
                this.preview.write(editorData);
                // insertJs();
                // preview.body.innerHTML = editorData;
                this.preview.close();
                clearInterval(this.timer);
            });
        }

        const documentContents = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Document</title>
            ${scriptBlocks}
            ${this._template === 'Handlebars' ? HANDLEBARS : ''}
            ${this._template === 'React' ? REACT : ''}
            ${this._template === 'Vue' ? VUEJS : ''}
            ${this._template === 'RxJs5' ? (rxjsOutputStyle + rxjsOutputScript + RXJS_5) : ''}
            ${this._template === 'RxJs6' ? (rxjsOutputStyle + rxjsOutputScript + RXJS_6) : ''}
            <!-- <script type="text/babel" src="./MyExport.js"></script> -->
        </head>

        <body>
            ${this._template === 'React' ? APP_ROOT : ''}
            ${editorData}
        </body>

        </html>`;

        this.renderOutput(documentContents);
    }

    // Compile and Render code into iFrame
    renderOutput(editorData) {

        // var output = Babel.transform(editorData, { presets: ['es2015'] }).code;

        // 1. jQuery Way
        // let myFrame = $("#preview").contents().find('body');
        // myFrame.html(editorData);

        // 2. Vanilla JavaScript way
        this.preview.open();
        this.preview.write(editorData);
        // insertJs();
        // preview.body.innerHTML = editorData;
        this.preview.close();
        clearInterval(this.timer);
    }

    saveEditor() {
        // get the value of the data
        var value = this.codeMirror.getValue()
        console.log('Value :', value);
    }

    // Reset/Clear Editor value and output from iFrame
    resetEditor() {
        // Reset code editor
        this.textArea.value = '';
        this.codeMirror.setValue("");

        // Reset output area
        this.preview.open();
        this.preview.write('');
        this.preview.close();
        clearInterval(this.timer);
    }

    getCodeExamples() {

        // Method 1 : Using JavaScript fetch API
        // REF : https://css-tricks.com/the-simplest-ways-to-handle-html-includes/
        fetch("./examples.html")
            .then(response => {
                return response.text()
            })
            .then(data => {
                document.querySelector(".code-example-wrapper").innerHTML = data;
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightBlock(block);
                });
            });

        // Method 2 : Using HTML Imports
        // REF : https://www.html5rocks.com/en/tutorials/webcomponents/imports/
        // <link rel="import" href="examples.html" />
        /* if ('import' in document.createElement('link')) {
            var htmlImport = document.querySelector('link[rel="import"]');
            var htmlDoc = htmlImport.import;
            var htmlMessage = htmlDoc.querySelector('#example-content');
            document.querySelector('.code-example-wrapper').appendChild(htmlMessage.cloneNode(true));
        } */
    }

    initSass() {
        // https://github.com/medialize/sass.js/blob/master/docs/api.md
        var sass = new Sass('./js/dist/sass.worker.js');
        sass.options({
            // Format output: nested, expanded, compact, compressed
            style: Sass.style.expanded,
            // Decimal point precision for outputting fractional numbers
            // (-1 will use the libsass default, which currently is 5)
            precision: -1,
            indentedSyntax: false,
            // If you want inline source comments
            comments: false,
            // String to be used for indentation
            indent: '  ',
            // String to be used to for line feeds
            linefeed: '\n',
        }, function callback() {
            // invoked without arguments when operation completed
        });
        /*
        var scss = `$someVar: 123px; .some-selector { width: $someVar; }
        body {
            p {
                color: red;
            }
        }
        `;
        sass.compile(scss, function (result) {
            console.log(result);
        }); */
    }

    // TODO : Currently not in use, remove if not required
    insertJs() {
        [
            'js/Rx-5.5.12.js',
            'js/react.development.js',
            'js/react-dom.development.js',
            'js/babel-6.26.0.js',
            'js/typescript/typescript.js',
            'https://unpkg.com/rxjs@6.5.2/bundles/rxjs.umd.min.js',
            'https://unpkg.com/rxjs@6.5.2/bundles/rxjs.umd.js'
        ].forEach(function (src) {
            var script = document.createElement('script');
            script.src = src;
            // script.async = false;
            preview.head.appendChild(script);
        });
    }

    // https://codetheory.in/babel-6-and-above-in-browser/
    // TODO : Currently not in use, remove if not required
    babelTranspile() {
        // Get all the babel scripts
        var babel_scripts = document.querySelectorAll('script[type="text/babel"]');
        // Loop over them
        Array.prototype.forEach.call(babel_scripts, function (script, index, arr) {
            // Get their contents
            var input = script.textContent;
            // Transform/Transpile/Compile
            var output = Babel.transform(input, { presets: ['es2015', 'react'] }).code;

            // Create a new script tag of `javascript` type
            var new_script = document.createElement('script');
            new_script.setAttribute('type', 'text/javascript');
            // Set the contents of the script to the transpiled code
            new_script.textContent = output;

            // Remove the babel script
            script.remove();
            // Inject the new transpiled JS
            document.querySelector('body').appendChild(new_script);
        });
    }

}

// document.addEventListener('DOMContentLoaded', (event) => {
let codeEditor = new Editor();
codeEditor.init();
// });

