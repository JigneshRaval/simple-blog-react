// Tags.component.tsx

// Display list of all the unique tags

import React, { useEffect } from 'react';
import { useFetch } from '../../services/useFetch.hook';


const Tags = (props: any) => {

    useEffect(() => {
        console.log('Tags mounted');
    }, []);

    const data = useFetch(`/api/articles/tags`, {});

    if (!data.response) return null;
    const tags = data.response.tags;
    const total = Object.keys(tags).length;

    return (
        <nav className="tags-wrapper tags-wrapper--aside">
            <p className="tag-list__header"><i className="ion ion-md-pricetags"></i><strong>Tags</strong></p>
            <ul className="tag-list">
                <li className="tag-list__item" key="allArticles">
                    <a href="javascript: void(0);" data-tag-name="all" onClick={(event) => props.onFilterRecords(event, 'all')}>
                        All Articles <span className="post-counts">{props.articleCount}</span>
                    </a>
                </li>
                <li className="tag-list__item" key="all">
                    <a href="javascript: void(0);" data-tag-name="all" onClick={(event) => props.onFilterRecords(event, 'all')}>
                        All Tags <span className="post-counts">{total}</span>
                    </a>
                </li>
                {
                    total > 0 ? Object.keys(tags).sort().map(tag => {
                        return (
                            <li className="tag-list__item" key={tag}>
                                <a href="javascript: void(0);" data-tag-name={tag} onClick={(event) => props.onFilterRecords(event, 'tag')}>
                                    {tag} <span className="post-counts">{tags[tag]}</span>
                                </a>
                            </li>
                        )
                    }) : <p>Tags are not available</p>
                }
            </ul>
        </nav>
    )
}

export default Tags;
