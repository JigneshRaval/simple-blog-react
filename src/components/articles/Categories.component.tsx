// Categories.component.tsx

// Display list of all the unique Categories

import React from 'react';

import Utils from '../../services/utils';
const utils = new Utils;

const Categories = ({ articles, onFilterRecords }: any) => {

    return (
        <nav className="category-wrapper category-wrapper--aside">
            <p className="category-list__header"><i className="ion ion-md-folder"></i> <strong>Categories</strong></p>
            <ul className="category-list">
                <li className="category-list__item">
                    <a href="javascript: void(0);" data-tag-name='all' onClick={(event) => onFilterRecords(event, 'all')}>
                        <i className="tag-list__icon icon-technology"><img src="/assets/images/icons/{{this}}.svg" /></i> All
                    </a>
                </li>
                {
                    utils.getUniqueCategories(articles).map((category: any, index: number) => {
                        return (
                            <li className="category-list__item" key={category}>
                                <a href="javascript: void(0);" data-tag-name={category} onClick={(event) => onFilterRecords(event, 'category')}>
                                    <i className="tag-list__icon icon-technology"><img src="/assets/images/icons/{{this}}.svg" /></i> {category}
                                </a>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    )
}

export default Categories;
