// Article-List-Item.component.tsx

// Single item in the list

// REACT
// ==========================
import React, { useEffect } from 'react';
// import { Link } from "react-router-dom";

// COMPONENTS
// ==========================
import TagsInline from './Tags-Inline.component';


const ArticleListItem = (props: any) => {

    // console.log('Article list item props :', props);

    // IMP : Added this to not render whole list every time when user clicks on any article from left navigation
    // or any new article added or deleted, or filtering or serching articles
    useEffect(() => {
        // console.log('activeTab : ', props);
    }, []);

    // Removed in favour of event delegation
    // Attached event to parent component and will listen event from there
    const getArticleContent = (articleId: any, index: number) => {
        props.onDisplaySingleArticleContent(articleId);
        props.onActivateTab(index);
    }

    const { article, onDeleteArticle, onEditArticle, onFilterArticles, markAsFavorite, activeTab, index, onAddToastMessage } = props;

    return (
        <div className={"uk-card uk-card-default" + (activeTab === index ? ' active' : '')} key={article._id}>

            <div className="card" data-category={article.category}>
                <div className="card-controls uk-inline">
                    <button className="uk-button uk-button-link" type="button"><i uk-icon="more-vertical"></i></button>
                    <div uk-dropdown="mode: click; pos: bottom-right" className="uk-dropdown-bottom-right">
                        <ul className="uk-nav uk-dropdown-nav">
                            <li className="uk-nav-header">Actions</li>
                            <li className="uk-active"><a href="javascript:void(0);" onClick={() => onEditArticle(article._id, true)}><span uk-icon="pencil"></span> Edit Article</a></li>
                            <li><a href="javascript:void(0);" onClick={() => onAddToastMessage('warning', `Are you sure you want to delete this article?.`, true, article._id)}><span uk-icon="trash"></span> Delete Article</a></li>
                            <li><a href="javascript:void(0);" onClick={() => markAsFavorite(article._id, article.favorite)} data-favorite={article.favorite}><span uk-icon="star"></span> Mark as Favorite</a></li>
                            <li className="uk-nav-header">Tags</li>
                            <TagsInline article={article} onFilterArticles={props.onFilterArticles} />
                            <li><a href="javascript:void(0);" onClick={(event) => onFilterArticles(event, 'all')}>Clear filter</a></li>
                        </ul>
                    </div>
                </div>

                <div className="card-header">
                    {
                        article.favorite ? <span className="isFavorite" aria-label="favorite"><i className="corner"></i><i className="icon ion-ios-star"></i></span> : ''
                    }
                    <div className="article-category"><span className="small-dot" data-category={article.category.toLowerCase()}></span>{article.category}</div>
                    <h2 className="uk-card-title">
                        {/* <Link to={'/articles/' + article._id} onClick={() => props.onActivateTab(index)}>{article.title}</Link> */}
                        <a href="javascript: void(0);" article-id={article._id} onClick={() => getArticleContent(article._id, index)}>{article.title}</a>
                        {/* <a href="javascript: void(0);" article-id={article._id} onClick={(event) => props.click(event, article._id, index, props.onActivateTab)}>{article.title}</a> */}
                    </h2>
                </div>

                <div className="card-footer">
                    <div>

                    </div>
                </div>
            </div>

        </div>
    );

}

export default ArticleListItem;
