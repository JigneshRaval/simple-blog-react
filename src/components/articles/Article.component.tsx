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

interface IArticle {
    author: string;
    category: string;
    coverImage: string;
    date: string;
    dateCreated: number;
    excerpt: string;
    filePath: string;
    htmlCode: string;
    path: string;
    sourceUrl: string;
    tags: Array<string>;
    title: string;
    type: string;
    readonly _id: string;
}

interface IArticleProps {
    currentRecord: IArticle;
    // onFilterRecords(event: any, filterBy: string): void;
    onFilterRecords: (event: any, filterBy: string) => void;
}


export const Article = (props: IArticleProps) => {

    const { currentRecord: article } = props;

    const DEMO_ID = article._id + '_' + Math.random().toString(36).substring(2);

    const insertAfter = (el: any, referenceNode: any) => {
        referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
    };

    const renderDemo = () => {
        let demos = document.querySelectorAll('.article__content [data-demo="code"]');
        if (demos && demos.length > 0) {
            [].forEach.call(demos, (demo: any, index: number) => {
                // 1. Create iFrame and insert it after .demo_code
                let iFrame = document.createElement('iframe');
                iFrame.className = 'demo_output';
                iFrame.style.resize = 'both';
                iFrame.id = DEMO_ID;
                insertAfter(iFrame, demo);

                /* let resizeHandle = document.createElement('div');
                resizeHandle.className = 'separator';
                resizeHandle.id = DEMO_ID;
                insertAfter(resizeHandle, iFrame); */

                // 2. Get code from .demo_code container and pass it to createDemoApp function to render the output
                let demoContent = demo.innerText;
                let templateName = (demo.getAttribute('data-demo-template') || demo.getAttribute('data-template')) || 'JavaScript';
                if (demoContent) {
                    utils.createDemoApp(demoContent, templateName, iFrame);
                }

                // 3. Adjusting the iframe height onload event
                // iFrame.onload = 'this.height=this.contentWindow.document.body.scrollHeight;';
                iFrame.onload = function () {
                    iFrame.style.height = (iFrame.contentWindow.document.body.scrollHeight + 50) + 'px';
                };

                // 4. Add Demo title
                let demoTitle = document.createElement('H2');
                demoTitle.innerText = 'Demo : ' + templateName;

                demo.parentNode.insertBefore(demoTitle, demo);
            });
        }
    };

    useEffect(() => {
        // highlight syntax : https://highlightjs.org/
        $(document).ready(function () {
            $('.article__content').find('pre code').each(function (i: any, block: any) {
                hljs.highlightBlock(block);
            });

            // Highlight search words in content
            setTimeout(() => {
                // utils.highlightSearchTerms();
            }, 1000);

            /* let myHilitor = new Hilitor(); // id of the element to parse
            if (myHilitor) {
                let searchTerms = document.querySelector('.search-form-input');
                if (searchTerms) {
                    myHilitor.apply(searchTerms.value);
                }
            }
            */

            renderDemo();

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
    };

    const getSourceUrl = (url: string) => {
        let parser = document.createElement('a');
        parser.href = url;

        return {
            origin: parser.origin,          // => "http://example.com:3000"
            protocol: parser.protocol,      // => "http:"
            host: parser.host,              // => "example.com:3000"
            hostname: parser.hostname,      // => "example.com"
            port: parser.port,              // => "3000"
            // parser.pathname;             // => "/pathname/"
            // parser.hash;                 // => "#hash"
            // parser.search;               // => "?search=test"
        }

    }

    return (
        <article className="uk-article article-view">

            <div className="article-wrapper">
                <header className="article__header">
                    <div className="header__content">
                        <a href="#" className="article-category"><span className="category-color"></span> {article.category}</a>
                        <h1>
                            <a className="uk-link-reset" href={article.sourceUrl} title={article.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">{article.title}</a>
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
                        <p><strong>Website : <a className="uk-link-reset"
                            href={getSourceUrl(article.sourceUrl).origin}
                            title={article.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow">{getSourceUrl(article.sourceUrl).origin}</a>
                        </strong></p>
                    </div>
                </header>

                <div className="article__content">
                    {article.excerpt ? <p className="uk-text-lead">{article.excerpt}</p> : ''}
                    <article
                        dangerouslySetInnerHTML={
                            createMarkup()
                        }>
                    </article>

                    {/* <article
                        dangerouslySetInnerHTML={{
                            __html: article.htmlCode
                        }}>
                    </article> */}
                </div>

                <footer className="article__footer">
                    <a href="javascript:void(0);" id="scrollToTop" className="scroll-top" onClick={scrollToTop}>
                        <i className="cc-chevrons-up"></i>
                        <span className="sr-only">Scroll To Top</span>
                    </a>
                </footer>
            </div>

        </article>
    );
};
