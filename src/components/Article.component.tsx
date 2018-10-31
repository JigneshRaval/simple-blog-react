// Article.component.tsx

// Display Single Article content on click of Article

import React, { Component } from "react";
import TagsInline from './Tags-Inline.component';

// let ShowdownService = require("../assets/js/showdown.js");

// Showdown: Convert Markdown (.md) to HTML
// ==============================================
// const converter = new ShowdownService.Converter();

export const Article = (props: any) => {

    const { currentArticle: article } = props;

    function createMarkup() {
        // return { __html: converter.makeHtml(article.htmlCode) };

        // highlight syntax : https://highlightjs.org/
        $(document).ready(function () {
            $('pre code').each(function (i: any, block: any) {
                hljs.highlightBlock(block);
            });
        });

        return { __html: article.htmlCode };
    }

    return (
        <article className="uk-article article-view">
            <div className="article-wrapper">
                <header className="article__header">
                    <h1 className="uk-article-title"><a className="uk-link-reset" href="">{article.title}</a></h1>

                    <p className="uk-article-meta">Written by <a href="#">{article.author}</a> on {article.dateCreated}. Posted in <a href="#">{article.category}</a> | <a href={article.sourceUrl} target="_blank">Original Source</a></p>

                    <p className="uk-text-lead">{article.excerpt}</p>
                </header>

                <div className="article__content" dangerouslySetInnerHTML={createMarkup()}></div>

                <footer>
                    <div className="uk-grid-small uk-child-width-auto" uk-grid="true">
                        <TagsInline article={article} onFilterArticles={props.onFilterArticles} className={'post-list__tags uk-button uk-button-text'} />
                    </div>
                </footer>
            </div>
        </article>
    )
}
