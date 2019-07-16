// Tags-Inline.component.tsx

/**
 * This component will render list of Tags
 */
import React from 'react';

const TagsInline = ({ article, onFilterArticles, className }: any) => {
    if (className) {
        return article.tags.map((tag: any) => {
            return <a key={tag} href="javascript:void(0);" className={className} data-tag-name={tag} onClick={(event) => onFilterArticles(event, 'tag')}>#{tag.trim()}</a>
        });
    } else {
        return article.tags.map((tag: any) => {
            return <li key={tag}><a href="javascript:void(0);" className={className} data-tag-name={tag} onClick={(event) => onFilterArticles(event, 'tag')}><span uk-icon="tag"></span> #{tag.trim()}</a></li>;
        });
    }

}

export default TagsInline;
