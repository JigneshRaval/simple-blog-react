// https://hackernoon.com/you-might-not-need-controlled-components-fy1g360o

import React, { useRef, useCallback, useState, useEffect } from 'react';
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

let codeMirror: any;
let preview: any;

const CreateDemoForm = (props: any) => {
    const [_template, setTemplate] = useState('JavaScript');
    let timer: any;
    let editorData = '';
    // let _template = 'JavaScript';
    let previewFrame: any = useRef<HTMLIFrameElement>();
    // let preview = previewFrame.current.contentDocument || previewFrame.current.contentWindow.document;
    // let preview: any;
    let textArea = document.getElementById('code');


    const { editData, isEditMode } = props;

    const codeRef = useRef<HTMLFormElement>();

    let dateCreated = new Date().getTime();
    let id = editData._id || '';


    const sendValues = () => {
        console.log(codeRef.current);
    };

    const setFormValues = () => {
        id = editData._id || '';
        dateCreated = editData.dateCreated || new Date().getTime();
    };

    // Handle Html to Markdown form submit
    const handleSubmit = (event: any) => {
        event.preventDefault();

        // Syntax : var formData = new FormData(form)
        // Ref : https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        const form = event.target;
        const formData = new FormData(form);

        // Tags
        let tags: any = formData.get('txtTags');
        if (tags) {
            tags = tags.split(',') || [];
        }


        const formDataObj = {
            date: new Date(),
            title: formData.get('txtPostTitle'),
        };

        // console.log('formDataObj === ', formDataObj);

        // remove wrapper node after all the code cleanup process
        // wrapperDiv.parentNode.removeChild(wrapperDiv);

        // Submit response to server
        // =====================================
        if (isEditMode) {
            // props.onEditSaveArticle(id, formDataObj);
            // form.reset();
        } else {
            // props.onCreateArticle(formDataObj);
        }

    };

    const handleReset = (event: any) => {
        event.preventDefault();
        // form.current.reset();
    };

    const initDemoEditor = () => {
        preview = previewFrame.current.contentDocument || previewFrame.current.contentWindow.document;
        textArea = document.getElementById('code');

        initCodeMirror();
        getCodeExamples();
    };

    /**
     * Initialize CodeMirror Editor
     */
    const initCodeMirror = () => {
        let editorArea = document.getElementById('code');
        console.log("codeMirror === ", codeMirror);
        codeMirror = window.CodeMirror.fromTextArea(editorArea, {
            lineNumbers: true,
            lineWrapping: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            styleActiveLine: true,
            mode: 'text/html',
            theme: 'tomorrow-night-bright',
            value: "function myScript(){return 100;}\n",
        });

        // Set default content in CodeMirror editor
        codeMirror.getDoc().setValue(CODEMIRROR_CONTENT);

        // Bind event listener with text area
        codeMirror.on("change", (event: any) => {
            editorData = codeMirror && codeMirror.getValue() || event.target && event.target.value || event.target && event.target.innerText;
            clearInterval(timer);

            timer = setInterval(() => {
                createApp(editorData);
            }, 1000);
        });

        // Bind event listener with text area
        /* editorArea.addEventListener('input change', (event) => {
            editorData = event.target.value || event.target.innerText;
            console.log('this.editorData :', editorData);
            clearInterval(timer);

            timer = setInterval(() => {
                createApp(editorData);
                // let block = document.querySelector('textarea') || document.querySelector('pre');
                // hljs.highlightBlock(block);
            }, 1000);
        }); */
    };

    /**
     * Set template name
     * @param {*} event
     */
    const _setTemplate = (event: any) => {
        resetEditor();
        let framework = event.target.parentNode.children[1].value || event.target.children[1].value;
        localStorage.setItem('editorTemplateName', framework);
        setTemplate(framework);
        let codeMirrorContent = document.querySelector(`.code-example-wrapper #${framework} pre code`).innerText;
        // Set default content in CodeMirror editor
        codeMirror.getDoc().setValue(codeMirrorContent || CODEMIRROR_CONTENT);
        // textArea.value = (codeMirrorContent || CODEMIRROR_CONTENT);
    };

    /* const getTemplate = () => {
        _template = localStorage.getItem('editorTemplateName');;
        return _template;
    }; */

    // Compile and Render code into iFrame
    const renderOutput = (editorData: any) => {

        // var output = Babel.transform(editorData, { presets: ['es2015'] }).code;

        // 1. jQuery Way
        // let myFrame = $("#preview").contents().find('body');
        // myFrame.html(editorData);

        // 2. Vanilla JavaScript way
        preview.open();
        preview.write(editorData);
        // insertJs();
        // preview.body.innerHTML = editorData;
        preview.close();
        clearInterval(timer);
    }

    const createApp = (editorData: any) => {
        let scriptBlocks = JQUERY + BOOTSTRAP_CSS + BOOTSTRAP_JS + REQUIRE_METHOD + BABEL + BABEL_PRESET_ENV;

        if (_template === 'SCSS') {
            /* sass.compile(editorData, (result) => {
                editorData = '<pre>' + result.text + '</pre>';
                console.log(result.text, editorData);
                this.preview.open();
                this.preview.write(editorData);
                // insertJs();
                // preview.body.innerHTML = editorData;
                this.preview.close();
                clearInterval(this.timer);
            }); */
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
            ${_template === 'Handlebars' ? HANDLEBARS : ''}
            ${_template === 'React' ? REACT : ''}
            ${_template === 'Vue' ? VUEJS : ''}
            ${_template === 'RxJs5' ? (rxjsOutputStyle + rxjsOutputScript + RXJS_5) : ''}
            ${_template === 'RxJs6' ? (rxjsOutputStyle + rxjsOutputScript + RXJS_6) : ''}
            <!-- <script type="text/babel" src="./MyExport.js"></script> -->
        </head>

        <body>
            ${_template === 'React' ? APP_ROOT : ''}
            ${editorData}
        </body>

        </html>`;

        renderOutput(documentContents);
    };

    const saveEditor = () => {
        // get the value of the data
        var value = codeMirror.getValue()
        console.log('Value :', value);
    };

    // Reset/Clear Editor value and output from iFrame
    const resetEditor = () => {
        // Reset code editor
        textArea.value = '';
        codeMirror.setValue("");

        // Reset output area
        preview.open();
        preview.write('');
        preview.close();
        clearInterval(timer);
    };

    const getCodeExamples = () => {

        // Method 1 : Using JavaScript fetch API
        // REF : https://css-tricks.com/the-simplest-ways-to-handle-html-includes/
        /* fetch("../../services/examples.html")
            .then(response => {
                return response.text()
            })
            .then(data => {
                document.querySelector(".code-example-wrapper").innerHTML = data;
                document.querySelectorAll('pre code').forEach((block) => {
                    // hljs.highlightBlock(block);
                });
            }); */

        // Method 2 : Using HTML Imports
        // REF : https://www.html5rocks.com/en/tutorials/webcomponents/imports/
        // <link rel="import" href="examples.html" />
        if ('import' in document.createElement('link')) {
            var htmlImport = document.querySelector('link[rel="import"]');
            var htmlDoc = htmlImport.import;
            var htmlMessage = htmlDoc.querySelector('#example-content');
            document.querySelector('.code-example-wrapper').appendChild(htmlMessage.cloneNode(true));
        }
    };

    useEffect(() => {
        console.log('SimpleUncontrolledForm :', props);
        // previewFrame = useRef<HTMLIFrameElement>();

        initDemoEditor();

        if (isEditMode) {
            setFormValues();
        } else {
            /* form.current.reset();
            form.current.txtTags.value = 'JavaScript, ES6'; */
        }

    }, [editData._id, _template]);

    return (
        <React.Fragment>
            <div className="modal fade" id="modal-create-demo" role="dialog" aria-labelledby="modal-create-demo_Title" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-full" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title" id="modal-create-demo_Title">
                                {
                                    isEditMode ? `Edit Demo` : 'Create New Demo'
                                }
                            </h2>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <section className="template-group-wrapper">
                            <div className="btn-group btn-group-toggle template-group" data-toggle="buttons" role="group"
                                aria-label="Basic example" onClick={(event) => _setTemplate(event)}>
                                <label className="btn btn-primary active">
                                    <img src="../../assets/images/icons/frameworks/js.png" />
                                    <input type="radio" name="template" id="templateJS" value="JavaScript" defaultChecked />
                                    JavaScript
                            </label>
                                <label className="btn btn-primary">
                                    <img src="../../assets/images/icons/frameworks/react.svg" />
                                    <input type="radio" name="template" id="templateReact" value="React" /> React
                            </label>
                                <label className="btn btn-primary">
                                    <img src="../../assets/images/icons/frameworks/vue.svg" />
                                    <input type="radio" name="template" id="templateVue" value="Vue" /> Vue.js
                            </label>
                                <label className="btn btn-primary">
                                    <img src="../../assets/images/icons/frameworks/rxjs.svg" />
                                    <input type="radio" name="template" id="templateRxJs5" value="RxJs5" /> RxJs 5
                            </label>
                                <label className="btn btn-primary">
                                    <img src="../../assets/images/icons/frameworks/rxjs.svg" />
                                    <input type="radio" name="template" id="templateRxJs6" value="RxJs6" /> RxJs 6
                            </label>
                                <label className="btn btn-primary">
                                    <img src="../../assets/images/icons/frameworks/sass.svg" />
                                    <input type="radio" name="template" id="templateSCSS" value="SCSS" /> SCSS
                            </label>
                                <label className="btn btn-primary">
                                    <img src="../../assets/images/icons/frameworks/handlebars.png" />
                                    <input type="radio" name="template" id="templateHandlebars" value="Handlebars" />
                                    Handlebars
                            </label>
                            </div>
                        </section>

                        <section className="[ d-flex flex-row ] editor-wrapper">
                            <article>
                                <textarea id="code" name="code" className="code-editor"></textarea>
                            </article>

                            <article>
                                <iframe id="preview" className="output" ref={previewFrame}></iframe>
                                <div id="output1"></div>
                            </article>
                        </section>

                        <div className="modal-footer">
                            <button id="convertToMarkdown" className="btn btn-primary"> {
                                props.isEditMode ? 'Update Article' : 'Save Article'
                            }</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button id="btnResetConvertForm" className="btn btn-secondary" onClick={handleReset}>Reset Form</button>
                        </div>

                    </div>
                </div>
            </div>


            <div className="modal fade bd-example-modal-xl" id="exampleModalLong" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Code Examples to try in editor by copying code
                </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Note:</strong> always use script <code>type="text/babel"</code> to transpile ES6+ code
                    into ES5</p>
                            <div className="code-example-wrapper">


                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default CreateDemoForm;
