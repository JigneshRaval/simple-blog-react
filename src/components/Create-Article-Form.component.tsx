import React from 'react';

// Turndown : Html to Markdown convertor
// let TurndownService = require('../assets/js/turndown.browser.umd.js');

// Showdown : Markdown to HTML convertor
// let ShowdownService = require('../assets/js/showdown.js');

// const converter = new ShowdownService.Converter();

export class CreateArticleFormComponent extends React.Component<any, any> {
    // turndownService: any;
    // editorOutput: any;
    convertedHTML: any;
    postPath: string;

    constructor(props: any) {
        super(props);

        console.log('Form props: ', props);

        // $('#txtareaHtmlCode').summernote('code', converter.makeHtml(props.editData.markdownCode));

        this.state = {
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
            // txtareaMarkdownCode: props.editData.markdownCode ? props.editData.markdownCode : ''
        }

        const [month, day, year] = new Date().toString().split('/');
        console.log(month, day, year);

        /* this.turndownService = new TurndownService({
            codeBlockStyle: 'fenced',
            fence: '```',
            filter: 'br',
            replacement: function (content: any) {
                return '\r\n\r\n' + content + '\r\n\r\n'
            }
        });

        this.turndownService.keep(['br', 'pre', 'code']); */
    }

    componentDidMount() {
        $('#txtareaHtmlCode').summernote({
            placeholder: 'Write your article content here...',
            height: 300
        });
    }

    // As in UIKit model is opening in new div so props are not setting properly
    // Update form values when props changes
    componentWillReceiveProps(nextProps: any) {
        this.setState({
            id: nextProps.editData._id || '',
            dateCreated: nextProps.editData.dateCreated || new Date().getTime(),
            txtPostTitle: nextProps.editData.title || '',
            txtCategory: nextProps.editData.category || 'JavaScript',
            txtTags: (nextProps.editData.tags) ? nextProps.editData.tags.join() : 'JavaScript, ES6',
            txtAuthor: nextProps.editData.author || '',
            txtWebsiteUrl: nextProps.editData.sourceUrl || '',
            txtSavePostToPath: nextProps.editData.path || '',
            txtPostType: nextProps.editData.type || 'Post',
            txtCoverImage: nextProps.editData.coverImage || '',
            txtExcerpt: nextProps.editData.excerpt || '',
            txtareaHtmlCode: nextProps.editData.htmlCode ? $('#txtareaHtmlCode').summernote('code', nextProps.editData.htmlCode) : '',
            //txtareaMarkdownCode: nextProps.editData.markdownCode ? nextProps.editData.markdownCode : ''
        })
    }

    formatDate(date: any, format: string) {
        let dateObj = new Date(date);

        let year = dateObj.getFullYear();
        let month = dateObj.getMonth() + 1;
        let day = dateObj.getDate();

        // return {year, month, day}
        return `${month}/${day}/${year}`;
    }

    handleInputChange = (event: any) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    // Handle Html to Markdown form submit
    handleSubmit = (event: any) => {
        event.preventDefault();

        // this.editorOutput = document.querySelector('#txtareaMarkdownCode');

        // Syntax : var formData = new FormData(form)
        // Ref : https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        const form = event.target;
        const formData = new FormData(form);

        /* this.convertedHTML = this.convert(formData.get('txtareaHtmlCode'));
        this.editorOutput.value = this.convertedHTML; */

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
            dateCreated: this.state.dateCreated,
            coverImage: formData.get('txtCoverImage'),
            type: formData.get('txtPostType')
        }

        const frontmatter = this.generateFrontMatter(frontmatterObj);


        // Final Form Object to pass to server
        const formDataObj = {
            ...frontmatterObj,
            'frontmatter': frontmatter,
            'htmlCode': this.sanitizeHtml(formData.get('txtareaHtmlCode') || $('#txtareaHtmlCode').summernote('code')),
            'filePath': `pages/${frontmatterObj.category + '/'}${formData.get('txtSavePostToPath') + '.md'}`,
            //'markdownCode': this.convertedHTML
        }

        console.log('HTML Code ==== ', formData.get('txtareaHtmlCode'));
        console.log('formDataObj ==== ', formDataObj);

        if (this.props.isEditMode) {
            this.props.onEditSaveArticle(this.state.id, formDataObj);
            form.reset();
        } else {
            this.props.onCreateArticle(formDataObj);
            form.reset();
        }

        // this.props.onToggleAddEditForm(false);
        UIkit.modal('#modal-example').hide();
    }

    // Clean HTML tags by removing Class, ID and Style attributes
    sanitizeHtml(html: any) {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.id = "wrapper-container";
        wrapperDiv.innerHTML = html;

        wrapperDiv.querySelectorAll('*').forEach(node => {
            if (node.parentElement && (node.parentElement.nodeName !== 'PRE' || node.parentElement.nodeName !== 'CODE')) {
                node.removeAttribute('id');
                node.removeAttribute('class');
                node.removeAttribute('style');
                node.removeAttribute('name');
            }

            /* if (node.nodeName !== 'PRE') {
                node.removeAttribute('id');
                node.removeAttribute('class');
                node.removeAttribute('style');
            } */
        })

        return wrapperDiv.innerHTML;
    }

    // convert HTML code to Markdown formate
    /* convert(htmlContent: any) {
        if (htmlContent) {
            var markdown = this.turndownService.turndown(htmlContent);
            return markdown;
        } else {
            return null;
        }
    } */


    /**
     *
     * @param frontmatterObj
     */
    generateFrontMatter(frontmatterObj: any) {

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

    handleReset = (event: any) => {
        event.preventDefault();

        const form = document.querySelector('#formCreateEditArticle');
        form.reset();
        // this.props.onToggleAddEditForm(false);
    }

    render() {
        return (
            <div id="modal-example" className="uk-modal-full" uk-modal="true">
                <div className="uk-modal-dialog uk-modal-body">
                    <h2 className="uk-modal-title">Create Article</h2>
                    <button className="uk-modal-close-full uk-close-large uk-align-right" type="button" uk-close=""></button>

                    <form name="formCreateEditArticle" id="formCreateEditArticle" method="POST" onSubmit={this.handleSubmit} encType="multipart/form-data">
                        <div className="uk-grid uk-grid-small">
                            <div className="uk-width-3-3@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtPostTitle">Title</label>
                                    <input type="text" className="uk-input" name="txtPostTitle" id="txtPostTitle" placeholder="Post Title" onChange={this.handleInputChange} value={this.state.txtPostTitle} />
                                </div>
                            </div>
                        </div>

                        <div className="uk-grid uk-grid-small">
                            <div className="uk-width-1-3@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtCategory">Category</label>
                                    <select value={this.state.txtCategory} className="uk-select" name="txtCategory" id="txtCategory" onChange={this.handleInputChange}>
                                        <option value="Accessibility">Accessibility</option>
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="ES6">ES6</option>
                                        <option value="HTML5">HTML5</option>
                                        <option value="CSS">CSS</option>
                                        <option value="React">React</option>
                                        <option value="Angular">Angular</option>
                                        <option value="RxJs">RxJs</option>
                                        <option value="Redux">Redux</option>
                                        <option value="Vue.js">Vue.js</option>
                                        <option value="Webpack">Webpack</option>
                                        <option value="Node.js">Node.js</option>
                                        <option value="NPM">NPM</option>
                                    </select>
                                    {/* <input type="text" className="uk-input" name="txtCategory" id="txtCategory" placeholder="Category" onChange={this.handleInputChange} value={this.state.txtCategory} /> */}
                                </div>
                            </div>
                            <div className="uk-width-1-3@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtTags">Tags</label>
                                    <input type="text" className="uk-input" name="txtTags" id="txtTags" placeholder="Tags" onChange={this.handleInputChange} value={this.state.txtTags} />
                                </div>
                            </div>
                            <div className="uk-width-1-3@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtAuthor">Author</label>
                                    <input type="text" className="uk-input" name="txtAuthor" id="txtAuthor" placeholder="Author" onChange={this.handleInputChange} value={this.state.txtAuthor} />
                                </div>
                            </div>
                        </div>

                        <div className="uk-grid uk-grid-small">
                            <div className="uk-width-1-2@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtWebsiteUrl">Website URL</label>
                                    <input type="text" className="uk-input" name="txtWebsiteUrl" id="txtWebsiteUrl" placeholder="Website URL" onChange={this.handleInputChange} value={this.state.txtWebsiteUrl} />
                                </div>
                            </div>
                            <div className="uk-width-1-3@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtSavePostToPath">Path to Save</label>
                                    <input type="text" className="uk-input" name="txtSavePostToPath" id="txtSavePostToPath" onChange={this.handleInputChange} value={this.state.txtSavePostToPath} />
                                </div>
                            </div>
                            <div className="uk-width-1-6@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtPostType">Post Type</label>
                                    <input type="text" className="uk-input" name="txtPostType" id="txtPostType" onChange={this.handleInputChange} value={this.state.txtPostType} />
                                </div>
                            </div>
                        </div>

                        <div className="uk-grid uk-grid-small">
                            <div className="uk-width-1-2@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtCoverImage">Cover Image</label>
                                    <input type="text" className="uk-input" name="txtCoverImage" id="txtCoverImage" placeholder="Image path..." onChange={this.handleInputChange} value={this.state.txtCoverImage} />
                                </div>
                            </div>
                            <div className="uk-width-1-2@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtExcerpt">Excerpt</label>
                                    <input type="text" className="uk-input" name="txtExcerpt" id="txtExcerpt" placeholder="Excerpt" onChange={this.handleInputChange} value={this.state.txtExcerpt} />
                                </div>
                            </div>
                        </div>

                        <div className="uk-grid uk-grid-small">
                            <div className="uk-width-1-1@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtareaHtmlCode">HTML code</label>
                                    <textarea className="uk-textarea" rows="10" name="txtareaHtmlCode" id="txtareaHtmlCode" onChange={this.handleInputChange} value={this.state.txtareaHtmlCode}></textarea>
                                </div>
                            </div>
                            {/* <div className="uk-width-1-2@m">
                                <div className="uk-margin">
                                    <label className="form-label" htmlFor="txtareaMarkdownCode">Markdown code</label>
                                    <textarea className="uk-textarea" rows="10" name="txtareaMarkdownCode" id="txtareaMarkdownCode" onChange={this.handleInputChange} value={this.state.txtareaMarkdownCode}></textarea>
                                </div>
                            </div> */}
                        </div>

                        <p className="uk-text-right">
                            <button id="convertToMarkdown" className="uk-button uk-button-primary">Convert</button>
                            <button id="btnResetConvertForm" className="uk-button uk-button-default uk-modal-close" onClick={this.handleReset}>Reset Form</button>
                        </p>
                    </form>

                </div>
            </div>


        )
    }
}
