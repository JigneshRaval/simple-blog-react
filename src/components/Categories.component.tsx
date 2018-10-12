// Categories.component.tsx

// Display list of all the unique Categories

import React from 'react';

const Categories = ({ articles, onFilterArticles }: any) => {

    const getUniqueCategories = () => {
        let uniqueCategories = articles.reduce((uniqcats: any, article: any) => {
            if (uniqcats.indexOf(article.category) === -1) {
                uniqcats.push(article.category);
            }
            return uniqcats;
        }, []);

        // OUTPUT : ["JavaScript", "React", ...]
        return uniqueCategories;
    }

    return (
        <nav className="category-wrapper category-wrapper--aside">
            <p className="category-list__header"><strong>Categories</strong></p>
            <ul className="category-list">
                {
                    getUniqueCategories().map((category: any, index: number) => {
                        return (
                            <li className="category-list__item" key={index}>
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
