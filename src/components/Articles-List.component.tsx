import * as React from "react";
// import { ArticleService } from '../services/articles.service';

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export const ArticlesList = (props: any) => {

    const getArticles = () => {
        console.log('Get Articles 123 : ==', props.articleService.getArticlesData());
    }

    return (
        <div className="post-list__wrapper">
            <ul className="post-list" id="postList">
                {
                    props.articles.map((article: any) => {
                        return (
                            <li key={article._id} className="post-list__item" data-category={article.category}>

                                <div className="post-list__cover-image" >
                                    <span className="post-list__category">{article.category}</span>

                                </div>

                                <div className="post-list__content">
                                    <h2 className="post-list__title"><a href="javascript: void(0);" onClick={() => props.onDisplaySingleArticleContent(article._id)}>{article.title}</a></h2>
                                    <p className="post-list__excerpt">{article.excerpt}</p>
                                </div>

                                <div className="post-list__footer">
                                    {
                                        article.tags.map((tag: any) => {
                                            return <span key={tag} className="post-list__tags">{tag}</span>
                                        })
                                    }
                                    <button className="btn btn-primary btn-sm" onClick={() => props.onDeleteArticle(article._id)}>Remove</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => props.onEditArticle(article._id)}>Edit</button>
                                    <button className="btn btn-primary btn-sm" onClick={getArticles}>Edit</button>

                                </div>

                            </li>
                        )
                    })
                }
            </ul>
        </div>
    );

}
