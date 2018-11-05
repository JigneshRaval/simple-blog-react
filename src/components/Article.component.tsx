// Article.component.tsx

// Display Single Article content on click of Article

import React, { Component } from "react";
import TagsInline from './Tags-Inline.component';
import Utils from "../services/utils";
const utils = new Utils();
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

        // Scroll to top functionality
        setTimeout(() => {
            handleScrollEvent();
        }, 1000);

        return { __html: article.htmlCode };
    }

    const handleScrollEvent = () => {
        let timer;
        let scrollElement = document.querySelector('#scrollToTop');
        let scrollParentElement = document.querySelector('.article-view');
        if (scrollParentElement) {
            clearTimeout(timer);

            scrollParentElement.addEventListener('scroll', () => {
                timer = setTimeout(() => {
                    utils.getScrollPosition(scrollElement, scrollParentElement);
                }, 500);
            });
        }
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
                        <a href="#"><span className="category-color"></span> {article.category}</a>
                        <h1 className="uk-article-title"><a className="uk-link-reset" href={article.sourceUrl} target="_blank">{article.title}</a></h1>

                        <p className="uk-article-meta">Written by <a href="#">{article.author}</a> on {article.dateCreated}. <a href={article.sourceUrl} target="_blank">Original Source</a></p>
                        <div className="article__tags-list">
                            <TagsInline article={article} onFilterArticles={props.onFilterArticles} className={'uk-button'} />
                        </div>
                    </div>
                </header>

                <div className="article__content">
                    <p className="uk-text-lead">{article.excerpt}</p>
                    <article dangerouslySetInnerHTML={createMarkup()}></article>
                </div>

                <footer className="article__footer">


                    <a href="javascript:void(0);" id="scrollToTop" className="scroll-top" onClick={scrollToTop}>
                        <i className="icon-arrow-up">&#8593;</i>
                        <span className="sr-only">Scroll To Top</span>
                    </a>
                </footer>
            </div>
        </article>
    )
}
