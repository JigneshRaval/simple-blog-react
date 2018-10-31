// Tags-Inline.component.tsx

/**
 * This component will render list of Tags
 */
import React from 'react';

const TagsInline = ({ article, onFilterArticles, className }: any) => {
    return article.tags.map((tag: any) => {
        return <a key={tag} href="#" className={className} data-tag-name={tag} onClick={(event) => onFilterArticles(event, 'tag')}>#{tag}</a>
    });
}

export default TagsInline;
