const APP_ROOT = '<div id="root"></div>';

// CDN path : <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" crossorigin="anonymous"></script>
const JQUERY = '<script src="./assets/js/editor/jquery.min.js"><\/script>';

// CDN path : <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossorigin="anonymous">
const BOOTSTRAP_CSS = '<link rel="stylesheet" href="./assets/css/app.bundle.css" />';

// CDN path : <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" crossorigin="anonymous"></script>
// <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" crossorigin="anonymous"></script>
const BOOTSTRAP_JS = '<script src="./assets/js/editor/bootstrap.bundle.min.js"><\/script>';

const HANDLEBARS = '<script src="./assets/js/editor/handlebars/handlebars-v4.4.3.js"><\/script>';

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
<script src="./assets/js/editor/babel/babel.min.js" type="text/javascript"></script>
`;

// CDN path : https://unpkg.com/@babel/preset-env-standalone@7.7.3/babel-preset-env.min.js
const BABEL_PRESET_ENV = '<script src="./assets/js/editor/babel/babel-preset-env.js"><\/script>';

// CDN path : https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/5.1.2/react-router-dom.js
const REACT = `
<script src="./assets/js/editor/react/react.development.js" type="text/javascript"></script>
<script src="./assets/js/editor/react/react-dom.development.js" type="text/javascript"></script>
<script src="./assets/js/editor/react/react-router-dom.js" type="text/javascript"></script>
`;

const VUEJS = `
<script src="https://unpkg.com/vue@2.6.10/dist/vue.js"><\/script>
<script src="https://unpkg.com/vue-router@3.1.3/dist/vue-router.js"><\/script>
`;

const SCSS = '<script src="./assets/js/editor/sass/sass.js"><\/script>';

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
`;

export {
    APP_ROOT,
    JQUERY,
    BOOTSTRAP_CSS,
    BOOTSTRAP_JS,
    HANDLEBARS,
    REQUIRE_METHOD,
    BABEL,
    BABEL_PRESET_ENV,
    REACT,
    VUEJS,
    SCSS,
    RXJS_5,
    RXJS_6,
    rxjsOutputStyle,
    rxjsOutputScript,
    CODEMIRROR_CONTENT
}
