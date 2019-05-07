// Article-List-Item.component.tsx

// Single item in the list

// REACT
// ==========================
import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// COMPONENTS
// ==========================
import TagsInline from './Tags-Inline.component';


const ArticleListItem = (props: any) => {

    /* constructor(props: any) {
        super(props);
        this.state = {
            // isActive: this.props.activeTab
        }
    } */


    const getArticleContent = (articleId: any, index: number) => {
        props.onDisplaySingleArticleContent(articleId);
        props.onActivateTab(index);
        // this.setState({ active: !this.state.active });
    }

    // render() {
    const { article, onDeleteArticle, onEditArticle, onFilterArticles, markAsFavorite, activeTab, index } = props;

    return (
        <div className={"uk-card uk-card-default" + (activeTab === index ? ' active' : '')} key={article._id}>

            <div className="card" data-category={article.category}>
                <div className="card-controls uk-inline">
                    <button className="uk-button uk-button-link" type="button"><i uk-icon="more-vertical"></i></button>
                    <div uk-dropdown="mode: click; pos: bottom-right" className="uk-dropdown-bottom-right">
                        <ul className="uk-nav uk-dropdown-nav">
                            <li className="uk-nav-header">Actions</li>
                            <li className="uk-active"><a href="javascript:void(0);" onClick={() => onEditArticle(article._id, true)}><span uk-icon="pencil"></span> Edit Article</a></li>
                            <li><a href="javascript:void(0);" onClick={() => onDeleteArticle(article._id)}><span uk-icon="trash"></span> Delete Article</a></li>
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
                        <Link to={'/' + article._id}>{article.title}</Link>
                        {/* <a href="javascript: void(0);" onClick={() => getArticleContent(article._id, index)}>{article.title}</a> */}
                    </h2>
                </div>

                <div className="card-footer">
                    <div>

                    </div>
                </div>
            </div>

        </div>
    );
    // }
}

export default ArticleListItem;
