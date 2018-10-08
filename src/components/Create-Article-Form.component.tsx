import React from 'react';

// SERVICES
// import { ArticleService } from "../services/articles.service";

// Turndown : Html to Markdown convertor
let TurndownService = require("../assets/js/turndown.browser.umd.js");

export class CreateArticleFormComponent extends React.Component<{}, {}> {
    turndownService: any;
    editorOutput: any;
    convertedHTML: any;
    postPath: string;

    constructor(props: any) {
        super(props);

        console.log('CreateArticleFormComponent : ', props);

        this.state = {
            txtPostTitle: '',
            txtCategory: 'JavaScript',
            txtTags: 'JavaScript, ES6',
            txtPostDate: new Date(),
            txtWebsiteUrl: '',
            txtSavePostToPath: '',
            txtPostType: 'Post',
            txtCoverImage: '',
            txtExcerpt: '',
            txtareaHtmlCode: '',
            txtareaMarkdownCode: ''
        }

        this.turndownService = new TurndownService({
            codeBlockStyle: 'fenced',
            fence: '```',
            filter: 'br',
            replacement: function (content: any) {
                return '\n\n' + content + '\n\n'
            }
        });
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

        this.editorOutput = document.querySelector('#txtareaMarkdownCode');

        // Syntax : var formData = new FormData(form)
        // Ref : https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
        const form = event.target;
        const formData = new FormData(form);

        this.convertedHTML = this.convert(formData.get('txtareaHtmlCode'));
        this.editorOutput.value = this.convertedHTML;

        // Tags
        let tags: any = formData.get('txtTags');
        if (tags) {
            tags = tags.split(',');
        }

        // FrontMatter Object
        const frontmatterObj = {
            title: formData.get('txtPostTitle'),
            sourceUrl: formData.get('txtWebsiteUrl'),
            path: `${formData.get('txtCategory') + '/'}${formData.get('txtSavePostToPath')}`,
            category: formData.get('txtCategory'),
            tags: tags,
            excerpt: formData.get('txtExcerpt'),
            date: formData.get('txtPostDate'),
            coverImage: formData.get('txtCoverImage'),
            type: formData.get('txtPostType')
        }

        const frontmatter = this.generateFrontMatter(frontmatterObj);


        // Final Form Object to pass to server
        const formDataObj = {
            ...frontmatterObj,
            'frontmatter': frontmatter,
            // 'htmlCode': formData.get('txtareaHtmlCode'),
            'filePath': `pages/${frontmatterObj.category + '/'}${formData.get('txtSavePostToPath') + '.md'}`,
            'markdownCode': this.convertedHTML
        }

        this.props.onCreateArticle(formDataObj);

    }

    // convert HTML code to Markdown formate
    convert(htmlContent: any) {
        if (htmlContent) {
            var markdown = this.turndownService.turndown(htmlContent);
            return markdown;
        } else {
            return null;
        }
    }

    /**
     *
     * @param frontmatterObj
     */
    generateFrontMatter(frontmatterObj: any) {

        let frontMatter = `---
path: "${frontmatterObj.path}"
date: "${frontmatterObj.date}"
title: "${frontmatterObj.title}"
tags: [${frontmatterObj.tags.map((tag: any) => `"${tag.trim()}"`)}]
category: "${frontmatterObj.category}"
categoryColor: "#F3C610"
excerpt: "${frontmatterObj.excerpt}"
coverImage: "${frontmatterObj.coverImage}"
sourceUrl: "${frontmatterObj.sourceUrl}"
type: "${frontmatterObj.type}"
---
    `

        return frontMatter;
    }

    render() {
        return (
            <form name="formHtmltoMd" id="formHtmltoMd" method="POST" onSubmit={this.handleSubmit} encType="multipart/form-data">
                <div className="row">
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtPostTitle">Title</label>
                            <input type="text" className="form-control" name="txtPostTitle" id="txtPostTitle" placeholder="Post Title" onChange={this.handleInputChange} value={this.state.txtPostTitle} />
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtCategory">Category</label>
                            <input type="text" className="form-control" name="txtCategory" id="txtCategory" placeholder="Category" onChange={this.handleInputChange} value={this.state.txtCategory} />
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtTags">Tags</label>
                            <input type="text" className="form-control" name="txtTags" id="txtTags" placeholder="Tags" onChange={this.handleInputChange} value={this.state.txtTags} />
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtPostDate">Date</label>
                            <input type="date" className="form-control" name="txtPostDate" id="txtPostDate" placeholder="Tags" onChange={this.handleInputChange} value={this.state.txtPostDate} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtWebsiteUrl">Website URL</label>
                            <input type="text" className="form-control" name="txtWebsiteUrl" id="txtWebsiteUrl" placeholder="Website URL" onChange={this.handleInputChange} value={this.state.txtWebsiteUrl} />
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtSavePostToPath">Path to Save</label>
                            <input type="text" className="form-control" name="txtSavePostToPath" id="txtSavePostToPath" onChange={this.handleInputChange} value={this.state.txtSavePostToPath} />
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtPostType">Post Type</label>
                            <input type="text" className="form-control" name="txtPostType" id="txtPostType" onChange={this.handleInputChange} value={this.state.txtPostType} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtCoverImage">Cover Image</label>
                            <input type="text" className="form-control" name="txtCoverImage" id="txtCoverImage" placeholder="Image path..." onChange={this.handleInputChange} value={this.state.txtCoverImage} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtExcerpt">Excerpt</label>
                            <input type="text" className="form-control" name="txtExcerpt" id="txtExcerpt" placeholder="Excerpt" onChange={this.handleInputChange} value={this.state.txtExcerpt} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtareaHtmlCode">HTML code</label>
                            <textarea className="form-control" rows="10" name="txtareaHtmlCode" id="txtareaHtmlCode" onChange={this.handleInputChange} value={this.state.txtareaHtmlCode}></textarea>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtareaMarkdownCode">Markdown code</label>
                            <textarea className="form-control" rows="10" name="txtareaMarkdownCode" id="txtareaMarkdownCode" onChange={this.handleInputChange} value={this.state.txtareaMarkdownCode}></textarea>
                        </div>
                    </div>
                </div>

                <p className="text-right">
                    <button id="convertToMarkdown" className="btn btn-primary">Convert</button>
                    <button id="btnResetConvertForm" className="btn btn-secondary">Reset Form</button>
                </p>
            </form>
        )
    }
}
