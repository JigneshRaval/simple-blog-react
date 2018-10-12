import * as React from "react";
// import { ArticleService } from '../services/articles.service';

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export const ArticlesList = (props: any) => {
    console.log('Props :', props);
    const getArticles = () => {
        console.log('Get Articles 123 : ==', props.articleService.getArticlesData());
    }

    return (
        <div className="post-list__wrapper">
            <div className="columns">
                {
                    props.filteredArticles.map((article: any) => {
                        return (
                            <div className="column col-4 col-xs-12" key={article._id}>
                                <div className="card" data-category={article.category}>
                                    <div className="card-image">
                                        <img src="img/osx-el-capitan.jpg" className="img-responsive" />
                                    </div>
                                    <div className="card-header">
                                        <h2 className="card-title"><a href="javascript: void(0);" onClick={() => props.onDisplaySingleArticleContent(article._id)}>{article.title}</a></h2>
                                        <div className="card-subtitle text-gray">{article.category}</div>
                                    </div>
                                    <div className="card-body">
                                        <p className="post-list__excerpt">{article.excerpt}</p>
                                    </div>
                                    <div className="card-footer">
                                        <div>
                                            {
                                                article.tags.map((tag: any) => {
                                                    return <span key={tag} className="post-list__tags">{tag}</span>
                                                })
                                            }
                                        </div>
                                        <button className="btn btn-primary" onClick={() => props.onDeleteArticle(article._id)}>Remove</button>
                                        <button className="btn btn-primary" onClick={() => props.onEditArticle(article._id, true)}>Edit</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );

}
