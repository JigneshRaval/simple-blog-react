// Article.component.tsx

// Display Single Article content on click of Article

import React, { Component } from "react";
let ShowdownService = require("../assets/js/showdown.js");

// Showdown: Convert Markdown (.md) to HTML
// ==============================================
const converter = new ShowdownService.Converter();

export const Article = (props: any) => {

    function createMarkup() {
        return { __html: converter.makeHtml(props.currentArticle.markdownCode) };
    }

    return (
        <article dangerouslySetInnerHTML={createMarkup()}></article>
    )
}
