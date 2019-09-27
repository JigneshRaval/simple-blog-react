// Article.component.tsx

// Display Single Article content on click of Article

import React, { Component, useEffect } from "react";
import TagsInline from '../shared/Tags-Inline.component';
import Utils from "../../services/utils";
const utils = new Utils();
// let ShowdownService = require("../assets/js/showdown.js");

// Showdown: Convert Markdown (.md) to HTML
// ==============================================
// const converter = new ShowdownService.Converter();

declare var $: any;
declare var hljs: any;


export const Article = (props: any) => {

    const { currentRecord: article } = props;

    useEffect(() => {
        // highlight syntax : https://highlightjs.org/
        $(document).ready(function () {
            $('.article__content').find('pre code').each(function (i: any, block: any) {
                hljs.highlightBlock(block);
            });
        });
    }, [article._id]);


    const date = utils.formatDate('dd/mm/yyyy', '-', article.dateCreated);

    function createMarkup() {
        // return { __html: converter.makeHtml(article.htmlCode) };

        // Scroll to top functionality, added setTimeout due to DOM not available
        setTimeout(() => {
            utils.handleScrollEvent();
        }, 1000);

        return { __html: article.htmlCode };
    }

    // Go to top on click of up arrow
    const scrollToTop = (event: any) => {
        let scrollParentElement = document.querySelector('.article-view');
        utils.scrollToTop(scrollParentElement);
    }

    return (
        <article className="uk-article article-view">

            <div className="article-wrapper">
                <header className="article__header">
                    <div className="header__content">
                        <a href="#" className="article-category"><span className="category-color"></span> {article.category}</a>
                        <h1>
                            <a className="uk-link-reset" href={article.sourceUrl} title={article.sourceUrl} target="_blank" rel="noopener noreferrer">{article.title}</a>
                        </h1>

                        <p className="article-meta">Written by <a href="javascript:;"><strong>{article.author}</strong></a> on <strong>{date.toString()}</strong>.</p>
                        <div className="article__tags-list">
                            Tagged as
                            <ul>
                                <TagsInline
                                    data={article}
                                    onFilterRecords={props.onFilterRecords}
                                    className={''} />
                            </ul>
                        </div>
                    </div>
                </header>

                <div className="article__content">
                    {article.excerpt ? <p className="uk-text-lead">{article.excerpt}</p> : ''}
                    <article dangerouslySetInnerHTML={createMarkup()}></article>
                </div>

                <footer className="article__footer">
                    <a href="javascript:void(0);" id="scrollToTop" className="scroll-top" onClick={scrollToTop}>
                        <i className="cc-chevrons-up"></i>
                        <span className="sr-only">Scroll To Top</span>
                    </a>
                </footer>
            </div>

        </article>
    )
}
