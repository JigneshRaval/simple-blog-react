// Tags-Inline.component.tsx

/**
 * This component will render list of Tags
 */
import React from 'react';

const TagsInline = ({ data, onFilterRecords, className }: any) => {
    if (className) {
        return data.tags.map((tag: any) => {
            return <a key={tag} href="javascript:void(0);" className={className} data-tag-name={tag} onClick={(event) => onFilterRecords(event, 'tag')}>#{tag.trim()}</a>
        });
    } else {
        return data.tags.map((tag: any) => {
            return <li key={tag} className={className}><a href="javascript:void(0);" data-tag-name={tag} onClick={(event) => onFilterRecords(event, 'tag')}><span uk-icon="tag"></span> #{tag.trim()}</a></li>;
        });
    }

}

export default TagsInline;
