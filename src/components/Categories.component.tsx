// Categories.component.tsx

// Display list of all the unique Categories

import React from 'react';

import Utils from '../services/utils';
const utils = new Utils;

const Categories = ({ articles, onFilterArticles }: any) => {

    /* As we are calling utils.getUniqueCategories() function from Utils.ts
    so we don't need this function hence commented this code */
    /* const getUniqueCategories = () => {
        let uniqueCategories = utils.getUniqueCategories(articles);

        // OUTPUT : ["JavaScript", "React", ...]
        return uniqueCategories;
    } */

    return (
        <nav className="category-wrapper category-wrapper--aside">
            <p className="category-list__header"><i className="ion ion-md-folder"></i> <strong>Categories</strong></p>
            <ul className="category-list">
                <li className="category-list__item">
                    <a href="javascript: void(0);" data-tag-name='all' onClick={(event) => onFilterArticles(event, 'all')}>
                        <i className="tag-list__icon icon-technology"><img src="/assets/images/icons/{{this}}.svg" /></i> All
                    </a>
                </li>
                {
                    utils.getUniqueCategories(articles).map((category: any, index: number) => {
                        return (
                            <li className="category-list__item" key={category}>
                                <a href="javascript: void(0);" data-tag-name={category} onClick={(event) => onFilterArticles(event, 'category')}>
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
