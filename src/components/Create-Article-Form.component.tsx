import React, { useState, useEffect } from 'react';

import Utils from "../services/utils";
const utils = new Utils();

declare var $: any;
declare var UIkit: any;


let HelloButton = function () {
    var ui = $.summernote.ui;

    // create button
    var button = ui.button({
        contents: 'Code block',
        tooltip: 'hello',
        click: function () {
            $('#txtareaHtmlCode').summernote('editor.pasteHTML', '<pre><code class="html">Place your code here.</code></pre>');
        }
    });

    return button.render();   // return button as jquery object
}


export const CreateArticleFormComponent = (props: any) => {
    /*     convertedHTML: any;
        postPath: string;
        */
    let originalState: any;

    const [formState, updateFormState] = useState({
        id: props.editData._id || '',
        dateCreated: props.editData.dateCreated || new Date().getTime(),
        txtPostTitle: props.editData.title || '',
        txtCategory: props.editData.category || 'JavaScript',
        txtTags: (props.editData.tags) ? props.editData.tags.join() : 'JavaScript, ES6',
        txtAuthor: props.editData.author || '',
        txtWebsiteUrl: props.editData.sourceUrl || '',
        txtSavePostToPath: props.editData.path || '',
        txtPostType: props.editData.type || 'Post',
        txtCoverImage: props.editData.coverImage || '',
        txtExcerpt: props.editData.excerpt || '',
        txtareaHtmlCode: props.editData.htmlCode ? $('#txtareaHtmlCode').summernote('code', props.editData.htmlCode) : '',
    })

    useEffect(() => {
        originalState = formState;
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

        updateFormState({
            ...formState,
            id: props.editData._id || '',
            dateCreated: props.editData.dateCreated || new Date().getTime(),
            txtPostTitle: props.editData.title || '',
            txtCategory: props.editData.category || 'JavaScript',
            txtTags: (props.editData.tags) ? props.editData.tags.join() : 'JavaScript, ES6',
            txtAuthor: props.editData.author || '',
            txtWebsiteUrl: props.editData.sourceUrl || '',
            txtSavePostToPath: props.editData.path || '',
            txtPostType: props.editData.type || 'Post',
            txtCoverImage: props.editData.coverImage || '',
            txtExcerpt: props.editData.excerpt || '',
            txtareaHtmlCode: props.editData.htmlCode ? $('#txtareaHtmlCode').summernote('code', props.editData.htmlCode) : '',
            //txtareaMarkdownCode: props.editData.markdownCode ? props.editData.markdownCode : ''
        });

    }, [props.editData._id])


    const handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        updateFormState({
            ...formState,
            [name]: value
        });
    }

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
            tags = tags.split(',');
        }

        // FrontMatter Object
        const frontmatterObj = {
            date: new Date(),
            title: formData.get('txtPostTitle'),
            sourceUrl: formData.get('txtWebsiteUrl'),
            path: `${formData.get('txtCategory') + '/'}${formData.get('txtSavePostToPath')}`,
            category: formData.get('txtCategory'),
            tags: tags,
            author: formData.get('txtAuthor'),
            excerpt: formData.get('txtExcerpt'),
            dateCreated: formState.dateCreated,
            coverImage: formData.get('txtCoverImage'),
            type: formData.get('txtPostType')
        }

        const frontmatter = generateFrontMatter(frontmatterObj);

        let cleanCode;
        let testDiv = document.querySelector('#test');

        let wrapperDiv = document.createElement('div');
        wrapperDiv.id = "wrapper-container";
        wrapperDiv.innerHTML = $('#txtareaHtmlCode').summernote('code');

        wrapperDiv.querySelectorAll('pre').forEach((node: any) => {
            let codeContent = node.innerText || node.textContent;
            codeContent = codeContent.replace(/</ig, '&lt;');

            if (codeContent) {
                node.innerHTML = `<code>${codeContent}</code>`;
            }
        });

        (testDiv as Element).innerHTML = wrapperDiv.innerHTML; // $('#txtareaHtmlCode').summernote('code');

        cleanCode = utils.extractCleanCode(testDiv, testDiv.innerHTML, 'crayon-table');

        (testDiv as Element).innerHTML = cleanCode.innerHTML;

        cleanCode = utils.extractCleanCode(testDiv, testDiv.innerHTML, 'gist');

        (testDiv as Element).innerHTML = cleanCode.innerHTML;

        const formDataObj = {
            ...frontmatterObj,
            'frontmatter': frontmatter,
            'htmlCode': utils.sanitizeHtml(testDiv),
            'filePath': `pages/${frontmatterObj.category + '/'}${formData.get('txtSavePostToPath') + '.md'}`,
            //'markdownCode': this.convertedHTML
        }

        // Submit response to server
        // =====================================
        if (props.isEditMode) {
            props.onEditSaveArticle(formState.id, formDataObj);
            form.reset();
        } else {
            props.onCreateArticle(formDataObj);
            form.reset();
        }

        // let dbCon = props.firebase.database().ref('/articles');
        // dbCon.push({
        //     ...formDataObj
        // });

        $('#txtareaHtmlCode').summernote('reset');

    }

    /**
     *
     * @param frontmatterObj
     */
    const generateFrontMatter = (frontmatterObj: any) => {

        let frontMatter = `---
path: '${frontmatterObj.path}'
date: '${frontmatterObj.date}'
title: '${frontmatterObj.title}'
tags: [${frontmatterObj.tags.map((tag: any) => `'${tag.trim()}'`)}]
category: '${frontmatterObj.category}'
categoryColor: '#F3C610'
excerpt: '${frontmatterObj.excerpt}'
coverImage: '${frontmatterObj.coverImage}'
sourceUrl: '${frontmatterObj.sourceUrl}'
type: '${frontmatterObj.type}'
---
    `

        return frontMatter;
    }

    const handleReset = (event: any) => {
        event.preventDefault();
        const form: HTMLFormElement = document.querySelector('#formCreateEditArticle');
        form.reset();
        $('#txtareaHtmlCode').summernote('reset');
        updateFormState(originalState);
    }

    return (
        <div id="modal-example" className="uk-modal-full" uk-modal="true">
            <div className="uk-modal-dialog uk-modal-body">
                <h2 className="uk-modal-title">
                    {
                        props.isEditMode ? 'Edit Article' : 'Create New Article'
                    }
                </h2>
                <button className="uk-modal-close-full uk-close-large uk-align-right" type="button" uk-close=""></button>

                <form name="formCreateEditArticle" id="formCreateEditArticle" method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="uk-grid uk-grid-small">
                        <div className="uk-width-1-2@m">

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtPostTitle">Title</label>
                                <input type="text" className="uk-input" name="txtPostTitle" id="txtPostTitle" placeholder="Post Title" onChange={handleInputChange} value={formState.txtPostTitle} required />
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtWebsiteUrl">Website URL</label>
                                <input type="text" className="uk-input" name="txtWebsiteUrl" id="txtWebsiteUrl" placeholder="Website URL" onChange={handleInputChange} value={formState.txtWebsiteUrl} required />
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtCategory">Category</label>
                                <select value={formState.txtCategory} className="uk-select select" name="txtCategory" id="txtCategory" onChange={handleInputChange}>
                                    {
                                        props.categories.map((category: any) => {
                                            return <option key={category.id} value={category.name}>{category.name}</option>
                                        })
                                    }
                                </select>
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtTags">Tags</label>
                                <input type="text" className="uk-input" name="txtTags" id="txtTags" placeholder="Tags" onChange={handleInputChange} value={formState.txtTags} />
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtAuthor">Author</label>
                                <input type="text" className="uk-input" name="txtAuthor" id="txtAuthor" placeholder="Author" onChange={handleInputChange} value={formState.txtAuthor} />
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtExcerpt">Excerpt</label>
                                <input type="text" className="uk-input" name="txtExcerpt" id="txtExcerpt" placeholder="Excerpt" onChange={handleInputChange} value={formState.txtExcerpt} />
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtCoverImage">Cover Image</label>
                                <input type="text" className="uk-input" name="txtCoverImage" id="txtCoverImage" placeholder="Image path..." onChange={handleInputChange} value={formState.txtCoverImage} />
                            </div>

                            {/* <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtPostType">Post Type</label>
                                    <input type="text" className="uk-input" name="txtPostType" id="txtPostType" onChange={this.handleInputChange} value={this.formState.txtPostType} />
                                </div> */}

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtPostType">Post Type</label>
                                <select value={formState.txtPostType} className="uk-select select" name="txtPostType" id="txtPostType" onChange={handleInputChange}>
                                    <option value="Post">Post</option>
                                    <option value="Snippet">Snippet</option>
                                    <option value="Personal">Personal</option>
                                </select>
                            </div>

                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtSavePostToPath">Path to Save</label>
                                <input type="text" className="uk-input" name="txtSavePostToPath" id="txtSavePostToPath" onChange={handleInputChange} value={formState.txtSavePostToPath} />
                            </div>

                        </div>

                        <div className="uk-width-1-2@m">
                            <div contentEditable id="test" style={{ 'height': '500px', 'whiteSpace': 'pre-wrap', 'overflow': 'auto' }}>
                            </div>
                            <div className="uk-margin">
                                <label className="form-label" htmlFor="txtareaHtmlCode">HTML code</label>
                                <textarea className="uk-textarea" rows={10} name="txtareaHtmlCode" id="txtareaHtmlCode" onChange={handleInputChange} value={formState.txtareaHtmlCode}></textarea>
                            </div>

                        </div>
                    </div>

                    <div className="uk-grid uk-grid-small">
                        {/* <div className="uk-width-1-2@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtareaMarkdownCode">Markdown code</label>
                                    <textarea className="uk-textarea" rows="10" name="txtareaMarkdownCode" id="txtareaMarkdownCode" onChange={this.handleInputChange} value={this.formState.txtareaMarkdownCode}></textarea>
                                </div>
                            </div> */}
                    </div>

                    <p className="uk-text-right">
                        <button id="convertToMarkdown" className="uk-button uk-button-primary">
                            {
                                props.isEditMode ? 'Update Article' : 'Save Article'
                            }
                        </button>&nbsp;&nbsp;
                            <button id="btnResetConvertForm" className="uk-button uk-button-default" onClick={handleReset}>Reset Form</button>
                    </p>
                </form>

            </div>
        </div>


    )

}
