// Article.component.tsx

// Display Single Article content on click of Article

import React, { Component } from "react";
let ShowdownService = require("../assets/js/showdown.js");

// Showdown: Convert Markdown (.md) to HTML
// ==============================================
const converter = new ShowdownService.Converter();

export const Article = (props: any) => {

    const { currentArticle: article } = props;

    function createMarkup() {
        // return { __html: converter.makeHtml(article.htmlCode) };
        return { __html: article.htmlCode };
    }

    return (
        <article className="uk-article article-view">
            <header className="article__header">
                <h1 className="uk-article-title"><a className="uk-link-reset" href="">{article.title}</a></h1>

                <p className="uk-article-meta">Written by <a href="#">{article.author}</a> on {article.date}. Posted in <a href="#">{article.category}</a></p>

                <p className="uk-text-lead">{article.excerpt}</p>
            </header>
            <div className="article__content" dangerouslySetInnerHTML={createMarkup()}></div>
            <footer>
                <div className="uk-grid-small uk-child-width-auto" uk-grid="true">
                    <div>
                        <a className="uk-button uk-button-text" href="#">Read more</a>
                    </div>
                    <div>
                        <a className="uk-button uk-button-text" href="#">5 Comments</a>
                    </div>
                </div>
            </footer>
        </article>
    )
}
