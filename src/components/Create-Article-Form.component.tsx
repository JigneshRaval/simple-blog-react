import React from 'react';

// Turndown : Html to Markdown convertor
let TurndownService = require("../assets/js/turndown.browser.umd.js");

export class CreateArticleFormComponent extends React.Component {
    turndownService: any;
    editorOutput: any;
    convertedHTML: any;
    postPath: string;

    constructor(props: any) {
        super(props);

        this.turndownService = new TurndownService({
            codeBlockStyle: 'fenced',
            fence: '```',
            filter: 'br',
            replacement: function (content: any) {
                return '\n\n' + content + '\n\n'
            }
        });

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    init() {
        /* const formHtmlToMD = document.querySelector("#formHtmltoMd");

        if (formHtmlToMD) {
            formHtmlToMD.addEventListener("submit", e => {
                e.preventDefault();
                this.handleSubmit(e);
            });
        }
        const btnResetForm = document.querySelector("#btnResetConvertForm");

        if (btnResetForm) {
            btnResetForm.addEventListener("click", e => {
                //e.preventDefault();
                (formHtmlToMD as HTMLFormElement).reset();
            });
        }

        const txtPostTitle = document.querySelector("#txtPostTitle");
        const txtSavePostToPath = document.querySelector("#txtSavePostToPath");

        if (txtPostTitle) {
            txtPostTitle.addEventListener("blur", e => {
                //e.preventDefault();
                this.postPath = e.target.value.toLowerCase().replace(/[\s:\(\)\[\]_,\*]/gi, '-').replace('--', '-');
                txtSavePostToPath.value = this.postPath;
            });
        } */
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

    // Handle Html to Markdown form submit
    handleSubmit(event: any) {
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
            'frontmatter': frontmatter,
            'htmlCode': formData.get('txtareaHtmlCode'),
            // Path where to save generated .md file by server.js
            'filePath': `pages/${frontmatterObj.category + '/'}${formData.get('txtSavePostToPath') + '.md'}`,
            'markdownCode': this.convertedHTML,
            'coverImage': formData.get('txtCoverImage'),
            'category': formData.get('txtCategory')
        }

        // Post form data to server
        fetch('/articles/add', {
            method: 'POST',
            body: JSON.stringify(formDataObj),
            mode: 'cors',
            redirect: 'follow',
            headers: new Headers({
                'Content-Type': 'application/json'
                //"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`Data returned by server : `, data);
            })
            .catch((err) => {
                console.log(`Markdown file generated successfully to ${formDataObj.filePath}.`);
            });
    }

    senitizeInnerHtml(htmlContent: any) {
        let senitizedContent = htmlContent.replace(/style="[^"]*"/g, "");

        return senitizedContent;
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
tags: [${frontmatterObj.tags.map(tag => `"${tag.trim()}"`)}]
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
                            <input type="text" className="form-control" name="txtPostTitle" id="txtPostTitle" placeholder="Post Title" />
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtCategory">Category</label>
                            <input type="text" className="form-control" name="txtCategory" id="txtCategory" placeholder="Category" value="JavaScript" />
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtTags">Tags</label>
                            <input type="text" className="form-control" name="txtTags" id="txtTags" placeholder="Tags" value="JavaScript, ES6" />
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtPostDate">Date</label>
                            <input type="date" className="form-control" name="txtPostDate" id="txtPostDate" placeholder="Tags" />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtWebsiteUrl">Website URL</label>
                            <input type="text" className="form-control" name="txtWebsiteUrl" id="txtWebsiteUrl" placeholder="Website URL" />
                        </div>
                    </div>
                    <div className="col-12 col-md-4 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtSavePostToPath">Path to Save</label>
                            <input type="text" className="form-control" name="txtSavePostToPath" id="txtSavePostToPath" value="my-md-file" />
                        </div>
                    </div>
                    <div className="col-12 col-md-2 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtPostType">Post Type</label>
                            <input type="text" className="form-control" name="txtPostType" id="txtPostType" value="Post" />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtCoverImage">Cover Image</label>
                            <input type="text" className="form-control" name="txtCoverImage" id="txtCoverImage" placeholder="Image path..." />
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtExcerpt">Excerpt</label>
                            <input type="text" className="form-control" name="txtExcerpt" id="txtExcerpt" placeholder="Image path..." />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtareaHtmlCode">HTML code</label>
                            <textarea className="form-control" rows="10" name="txtareaHtmlCode" id="txtareaHtmlCode" ></textarea>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-sm-6">
                        <div className="form-group">
                            <label htmlFor="txtareaMarkdownCode">Markdown code</label>
                            <textarea className="form-control" rows="10" name="txtareaMarkdownCode" id="txtareaMarkdownCode"></textarea>
                        </div>
                    </div>
                </div>

                <p className="text-right">
                    <button id="convertToMarkdown" className="btn btn-primary" onClick={}>Convert</button>
                    <button id="btnResetConvertForm" className="btn btn-secondary">Reset Form</button>
                </p>
            </form>
        )
    }
}
