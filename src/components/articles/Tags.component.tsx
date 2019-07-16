// Tags.component.tsx

// Display list of all the unique tags

import React from 'react';

const Tags = (props: any) => {

    const total = Object.keys(props.tags).length;

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
                        All <span className="post-counts">{total}</span>
                    </a>
                </li>
                {
                    Object.keys(props.tags).sort().map(tag => {
                        return (
                            <li className="tag-list__item" key={tag}>
                                <a href="javascript: void(0);" data-tag-name={tag} onClick={(event) => props.onFilterArticles(event, 'tag')}>
                                    {tag} <span className="post-counts">{props.tags[tag]}</span>
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
