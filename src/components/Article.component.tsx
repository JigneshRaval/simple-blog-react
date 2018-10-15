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
        return { __html: converter.makeHtml(article.htmlCode) };
    }

    return (
        <article className="article-view">
            <header className="article__header">
                <h1>{article.title}</h1>
            </header>
            <div className="article__content" dangerouslySetInnerHTML={createMarkup()}></div>
            <footer>

            </footer>
        </article>
    )
}
