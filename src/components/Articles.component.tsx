import * as React from "react";
import { ArticleService } from '../services/articles.service';

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export const Articles = (props: any) => {

    // Delete single article by articleId
    const deleteArticle = (articleId: string): void => {
        props.articleService.deleteArticle(articleId);
    }

    return (
        <div>
            <ul>
                {
                    props.articles.map((article: any) => {
                        return <li key={article._id}>{article.name} <a onClick={() => deleteArticle(article._id)}>Remove</a></li>
                    })
                }
            </ul>
        </div>
    );

}
