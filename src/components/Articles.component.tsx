import * as React from "react";
// import { ArticleService } from '../services/articles.service';

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export const Articles = (props: any) => {
    return (
        <div className="post-list__wrapper">
            <ul className="post-list">
                {
                    props.articles.map((article: any) => {
                        return (
                            <li key={article._id} className="post-list__item">
                                {article.title} <a onClick={() => props.onDeleteArticle(article._id)}>Remove</a>
                                <a onClick={() => props.onEditArticle(article._id)}>Edit</a>
                            </li>)
                    })
                }
            </ul>
        </div>
    );

}
