// https://hackernoon.com/you-might-not-need-controlled-components-fy1g360o

import React, { useRef, useCallback, useState, useEffect } from 'react';
import Utils from "../../services/utils";
const utils = new Utils();

declare var $: any;

let HelloButton = function () {
    let ui = $.summernote.ui;

    // create button
    let button = ui.button({
        contents: 'Code block',
        tooltip: 'hello',
        click: function () {
            $('#txtareaHtmlCode').summernote('editor.pasteHTML', '<pre><code class="html">Place your code here.</code></pre>');
        }
    });

    return button.render();   // return button as jquery object
};

const SimpleUncontrolledForm = (props: any) => {

    const { editData, isEditMode, categories } = props;

    const form = useRef<HTMLFormElement>();

    let dateCreated = new Date().getTime();
    let id = editData._id || '';

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            const { txtPostTitle, txtWebsiteUrl } = e.target;
            console.log({ email: txtPostTitle.value, name: txtWebsiteUrl.value });
            e.target.reset();
        }, []
    );

    const sendValues = () => {
        const { txtPostTitle, txtWebsiteUrl }: any = form.current;
        console.log({ title: txtPostTitle.value, url: txtWebsiteUrl.value });
    };

    const cleanHTMLContent = () => {
        let cleanCode;
        let testDiv = document.querySelector('#test');

        let wrapperDiv = document.createElement('div');
        wrapperDiv.id = 'wrapper-container';

        // Add this wrapper div element to document body tag ( IMP )
        document.body.append(wrapperDiv);

        wrapperDiv.innerHTML = $('#txtareaHtmlCode').summernote('code');

        wrapperDiv.querySelectorAll('pre').forEach((node: any) => {
            let codeContent = node.innerText || node.textContent;
            codeContent = codeContent.replace(/</ig, '&lt;');

            if (codeContent) {
                node.innerHTML = `<code>${codeContent}</code>`;
            }
        });

        (testDiv as Element).innerHTML = wrapperDiv.innerHTML; // $('#txtareaHtmlCode').summernote('code');

        cleanCode = utils.extractCleanCode(testDiv, testDiv.innerHTML, 'crayon-table', '.crayon-syntax');

        (testDiv as Element).innerHTML = cleanCode.innerHTML;

        cleanCode = utils.extractCleanCode(testDiv, testDiv.innerHTML, 'github', '.codecolorer-container .codecolorer');

        (testDiv as Element).innerHTML = cleanCode.innerHTML;

        cleanCode = utils.extractCleanCode(testDiv, testDiv.innerHTML, 'gist');

        (testDiv as Element).innerHTML = cleanCode.innerHTML;

        setTimeout(() => {
            // remove wrapper node after all the code cleanup process
            wrapperDiv.parentNode.removeChild(wrapperDiv);
        }, 1000);

        return testDiv;
    };

    const setFormValues = () => {
        id = editData._id || '';
        dateCreated = editData.dateCreated || new Date().getTime();

        form.current.txtPostTitle.value = editData.title || '';
        form.current.txtCategory.value = editData.category || 'JavaScript';
        form.current.txtTags.value = (editData.tags) ? editData.tags.join() : 'JavaScript, ES6';
        form.current.txtAuthor.value = editData.author || '';
        form.current.txtWebsiteUrl.value = editData.sourceUrl || '';
        form.current.txtSavePostToPath.value = editData.path || '';
        form.current.txtPostType.value = editData.type || 'Post';
        form.current.txtCoverImage.value = editData.coverImage || '';
        form.current.txtExcerpt.value = editData.excerpt || '';
        form.current.txtareaHtmlCode.value = editData.htmlCode ? $('#txtareaHtmlCode').summernote('code', editData.htmlCode) : '';
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

        // TODO : Move it to separate function
        // Cleanup HTML content
        // ================================
        // let cleanCode;
        // let testDiv = document.querySelector('#test');

        // let wrapperDiv = document.createElement('div');
        // wrapperDiv.id = 'wrapper-container';

        // // Add this wrapper div element to document body tag ( IMP )
        // document.body.append(wrapperDiv);

        // wrapperDiv.innerHTML = $('#txtareaHtmlCode').summernote('code');

        // wrapperDiv.querySelectorAll('pre').forEach((node: any) => {
        //     let codeContent = node.innerText || node.textContent;
        //     codeContent = codeContent.replace(/</ig, '&lt;');

        //     if (codeContent) {
        //         node.innerHTML = `<code>${codeContent}</code>`;
        //     }
        // });

        // (testDiv as Element).innerHTML = wrapperDiv.innerHTML; // $('#txtareaHtmlCode').summernote('code');

        // cleanCode = utils.extractCleanCode(testDiv, testDiv.innerHTML, 'crayon-table');

        // (testDiv as Element).innerHTML = cleanCode.innerHTML;

        // cleanCode = utils.extractCleanCode(testDiv, testDiv.innerHTML, 'gist');

        // (testDiv as Element).innerHTML = cleanCode.innerHTML;

        const formDataObj = {
            date: new Date(),
            title: formData.get('txtPostTitle'),
            sourceUrl: formData.get('txtWebsiteUrl'),
            path: `${formData.get('txtCategory') + '/'}${formData.get('txtSavePostToPath')}`,
            category: formData.get('txtCategory'),
            tags: tags,
            author: formData.get('txtAuthor'),
            excerpt: formData.get('txtExcerpt'),
            dateCreated: dateCreated,
            coverImage: formData.get('txtCoverImage'),
            type: formData.get('txtPostType'),
            'htmlCode': utils.sanitizeHtml(cleanHTMLContent()),
            'filePath': `pages/${formData.get('txtCategory') + '/'}${formData.get('txtSavePostToPath') + '.md'}`
        };

        // console.log('formDataObj === ', formDataObj);

        // remove wrapper node after all the code cleanup process
        // wrapperDiv.parentNode.removeChild(wrapperDiv);

        // Submit response to server
        // =====================================
        if (isEditMode) {
            props.onEditSaveArticle(id, formDataObj);
            form.reset();
        } else {
            props.onCreateArticle(formDataObj);
        }

        // let dbCon = props.firebase.database().ref('/articles');
        // dbCon.push({
        //     ...formDataObj
        // });

        $('#txtareaHtmlCode').summernote('reset');

    };

    const handleReset = (event: any) => {
        event.preventDefault();
        form.current.reset();
        $('#txtareaHtmlCode').summernote('reset');
    };

    useEffect(() => {
        // console.log('SimpleUncontrolledForm :', props, form.current);

        $('#txtareaHtmlCode').summernote({
            placeholder: 'Write your article content here...',
            height: 600,
            minHeight: 200,
            toolbar: [
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['height', ['height']],
                ['insert', ['link', 'picture', 'table', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                // ['mybutton', ['hello']],
                ['help', ['help']]
            ],
            buttons: {
                hello: HelloButton
            },
            callbacks: {
                onPaste: function (event: any) {

                    // utils.sanitizeHtml($('#txtareaHtmlCode').summernote('code'));
                    // $("#summernote").code().replace(/&nbsp;|<br>/g, '<br/>');
                    // console.log('Called event paste', event);
                    // $('#txtareaHtmlCode').summernote('removeFormat');
                }
            }
        });

        if (isEditMode) {
            setFormValues();
        } else {
            form.current.reset();
            form.current.txtTags.value = 'JavaScript, ES6';
        }

    }, [editData._id]);

    return (

        <div className="modal fade" id="modal-articles" role="dialog" aria-labelledby="modal-articles_Title" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-full" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title" id="modal-articles_Title">
                            {
                                isEditMode ? `Edit Article` : 'Create New Article'
                            }
                        </h2>
                        <p><code>{isEditMode.toString()} : {id ? id : ''}</code></p>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <form ref={form} name="formCreateEditArticle" id="formCreateEditArticle" method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="modal-body">

                            <div className="form-row">

                                {/* START Column */}
                                <div className="col-6 col-sm-12 col-md-12 col-lg-6">

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtPostTitle">Title * ( required )</label>
                                        <input type="text" className="form-control" name="txtPostTitle" id="txtPostTitle" placeholder="Post Title" required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtWebsiteUrl">Website URL * ( required )</label>
                                        <input type="text" className="form-control" name="txtWebsiteUrl" id="txtWebsiteUrl" placeholder="Website URL" required />
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <label className="input-group-text" htmlFor="txtCategory">Category</label>
                                            </div>
                                            <select className="custom-select" name="txtCategory" id="txtCategory">
                                                {
                                                    categories.map((category: any) => {
                                                        return <option key={category.id} value={category.name}>{category.name}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <label className="input-group-text" htmlFor="txtTags">Tags</label>
                                            </div>
                                            <input type="text" className="form-control" name="txtTags" id="txtTags" placeholder="Tags" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <label className="input-group-text" htmlFor="txtAuthor">Author</label>
                                            </div>
                                            <input type="text" className="form-control" name="txtAuthor" id="txtAuthor" placeholder="Author" />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtExcerpt">Excerpt</label>
                                        <input type="text" className="form-control" name="txtExcerpt" id="txtExcerpt" placeholder="Excerpt" />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtCoverImage">Cover Image</label>
                                        <input type="text" className="form-control" name="txtCoverImage" id="txtCoverImage" placeholder="Image path..." />
                                    </div>

                                    {/* <div className="form-group">
                                    <label className="form-label" htmlFor="txtPostType">Post Type</label>
                                    <input type="text" className="form-control" name="txtPostType" id="txtPostType" onChange={this.handleInputChange} value={this.formState.txtPostType} />
                                </div> */}

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtPostType">Post Type</label>
                                        <select className="form-control" name="txtPostType" id="txtPostType">
                                            <option value="Post">Post</option>
                                            <option value="Snippet">Snippet</option>
                                            <option value="Personal">Personal</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtSavePostToPath">Path to Save</label>
                                        <input type="text" className="form-control" name="txtSavePostToPath" id="txtSavePostToPath" />
                                    </div>

                                </div>
                                {/* END Column */}

                                {/* START Column */}
                                <div className="col-6 col-sm-12 col-md-12 col-lg-6">
                                    <div contentEditable
                                        id="test"
                                        style={{ 'height': '50px', 'whiteSpace': 'pre-wrap', 'overflow': 'auto', 'opacity': 0.5, 'resize': 'vertical' }}>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="txtareaHtmlCode">HTML code</label>
                                        <textarea className="form-control" rows={10} name="txtareaHtmlCode" id="txtareaHtmlCode"></textarea>
                                    </div>

                                </div>
                                {/* END Column */}
                            </div>


                        </div>

                        <div className="modal-footer">
                            <button id="convertToMarkdown" className="btn btn-primary"> {
                                props.isEditMode ? 'Update Article' : 'Save Article'
                            }</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button id="btnResetConvertForm" className="btn btn-secondary" onClick={handleReset}>Reset Form</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SimpleUncontrolledForm;
