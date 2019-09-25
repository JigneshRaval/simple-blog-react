// Article-List-Item.component.tsx

// Single item in the list

// REACT
// ==========================
import React, { useEffect } from 'react';
// import { Link } from "react-router-dom";

// COMPONENTS
// ==========================
import TagsInline from '../shared/Tags-Inline.component';


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

    const { article, onDeleteArticle, onEditArticle, onFilterRecords, markAsFavorite, activeTab, index, onAddToastMessage } = props;

    return (
        <div className={"card" + (activeTab === index ? ' active' : '')} key={article._id} data-article-id={article._id} data-category={article.category}>

            <div className="card-controls dropdown">
                <button className="btn btn-link" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="cc-bx-dots-vertical-rounded"></i></button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <ul className="">
                        <li className="dropdown-header">Actions</li>
                        <li className="dropdown-item"><a href="javascript:void(0);" data-toggle="modal" data-target="#modal-articles" onClick={() => onEditArticle(article._id, true)}><i className="cc-bx-pencil"></i> Edit Article</a></li>
                        <li className="dropdown-item"><a href="javascript:void(0);" onClick={() => onAddToastMessage('warning', `Are you sure you want to delete this article?.`, true, article._id)}><i className="cc-bx-trash"></i> Delete Article</a></li>
                        <li className="dropdown-item"><a href="javascript:void(0);" onClick={() => markAsFavorite(article._id, article.favorite)} data-favorite={article.favorite}><i className="cc-bx-star"></i> Mark as Favorite</a></li>
                        <li className="dropdown-header">Tags</li>
                        <TagsInline data={article} onFilterRecords={props.onFilterRecords} className={'dropdown-item'} />
                        <li className="dropdown-item"><button className="btn btn-primary" onClick={(event) => onFilterRecords(event, 'all')}><i className="cc-bx-x-circle"></i> Clear filter</button></li>
                    </ul>
                </div>
            </div>

            <div className="card-body">
                {
                    article.favorite ? <span className="isFavorite" aria-label="favorite"><i className="corner"></i><i className="cc-bxs-star"></i></span> : ''
                }
                <div className="article-category"><span className="small-dot" data-category={article.category.toLowerCase()}></span>{article.category}</div>
                <h2 className="card-title">
                    {/* <Link to={'/articles/' + article._id} onClick={() => props.onActivateTab(index)}>{article.title}</Link> */}
                    <a href="javascript: void(0);" article-id={article._id} onClick={() => getArticleContent(article._id, index)}>{article.title}</a>
                    {/* <a href="javascript: void(0);" article-id={article._id} onClick={(event) => props.click(event, article._id, index, props.onActivateTab)}>{article.title}</a> */}
                </h2>
            </div>

        </div>
    );

}

export default ArticleListItem;
