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

    return (
        <nav className="tags-wrapper tags-wrapper--aside">
            <p className="tag-list__header"><strong>Tags</strong></p>
            <ul className="tag-list">
                {
                    Object.keys(getUniqueTags()).map(tag => {
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
