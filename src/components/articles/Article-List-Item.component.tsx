// Article-List-Item.component.tsx

// Single item in the list

// REACT
// ==========================
import React, { useEffect } from 'react';
// import { Link } from "react-router-dom";

// COMPONENTS
// ==========================
import TagsInline from '../shared/Tags-Inline.component';
import ActionMenu from '../shared/ActionMenu';


const ArticleListItem = (props: any) => {

    // console.log('Article list item props :', props);

    // IMP : Added this to not render whole list every time when user clicks on any article from left navigation
    // or any new article added or deleted, or filtering or searching articles
    useEffect(() => {
        // console.log('activeTab : ', props);
    }, []);

    // Removed in favour of event delegation
    // Attached event to parent component and will listen event from there
    const getArticleContent = (articleId: any, index: number) => {
        props.onDisplaySingleArticleContent(articleId);
        props.onActivateTab(index);
    }

    const { article, activeTab, index } = props;

    return (
        <div className={"card" + (activeTab === index ? ' active' : '')} key={article._id} data-article-id={article._id} data-category={article.category}>

            <ActionMenu
                type={'articles'}
                title={'Article'}
                data={article}
                {...props}
            />

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
