// Tags.component.tsx

// Display list of all the unique tags

import React from 'react';

const Tags = (props: any) => {

    const getUniqueTags = () => {
        const uniqeTags = props.articles.map((article: any) => article.tags)
            .reduce((allTags: any, tags: any) => allTags.concat(tags), [])
            .reduce((uniqtags: any, tag: any) => {
                uniqtags[tag.trim()] = (uniqtags[tag.trim()] || 0) + 1
                return uniqtags;
            }, {});

        // OUTPUT : {JavaScript: 3, ES6: 3, React: 1, Form: 1}
        return uniqeTags;
    }

    // Get total numbers of all the tags
    const count = () => {
        let total = 0;
        total = Object.keys(getUniqueTags()).length;
        /* let uniqueTags = getUniqueTags();
        let total = 0;
        Object.keys(uniqueTags).forEach(key => {
            total += uniqueTags[key];
        }); */

        return total;
    }

    return (
        <nav className="tags-wrapper tags-wrapper--aside">
            <p className="tag-list__header"><i className="ion ion-md-pricetags"></i><strong>Tags</strong></p>
            <ul className="tag-list">
                <li className="tag-list__item" key="allArticles">
                    <a href="javascript: void(0);" data-tag-name="all" onClick={(event) => props.onFilterArticles(event, 'all')}>
                        All Articles <span className="post-counts">{props.articleCount}</span>
                    </a>
                </li>
                <li className="tag-list__item" key="all">
                    <a href="javascript: void(0);" data-tag-name="all" onClick={(event) => props.onFilterArticles(event, 'all')}>
                        All <span className="post-counts">{count()}</span>
                    </a>
                </li>
                {
                    Object.keys(getUniqueTags()).sort().map(tag => {
                        return (
                            <li className="tag-list__item" key={tag}>
                                <a href="javascript: void(0);" data-tag-name={tag} onClick={(event) => props.onFilterArticles(event, 'tag')}>
                                    {tag} <span className="post-counts">{getUniqueTags()[tag]}</span>
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    )
}

export default Tags;
