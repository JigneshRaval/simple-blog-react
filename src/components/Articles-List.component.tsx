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
            <div className="uk-flex uk-flex-column">
                {
                    props.filteredArticles.map((article: any) => {
                        return (
                            <div className="uk-card uk-card-default" key={article._id}>
                                <div className="card" data-category={article.category}>
                                    <div className="card-controls uk-inline">
                                        <button className="uk-button uk-button-link" type="button"><i uk-icon="more-vertical"></i></button>
                                        <div uk-dropdown="mode: click; pos: bottom-right" className="uk-dropdown-bottom-right">
                                            <ul className="uk-nav uk-dropdown-nav">
                                                <li className="uk-active"><a href="javascript:void(0);" onClick={() => props.onEditArticle(article._id, true)}>Edit Article</a></li>
                                                <li><a href="javascript:void(0);" onClick={() => props.onDeleteArticle(article._id)}>Delete Article</a></li>
                                                {/* <li className="uk-nav-header">Fevorite</li> */}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* <div className="card-image">
                                        <img src="img/osx-el-capitan.jpg" className="img-responsive" />
                                    </div> */}

                                    <div className="card-header">
                                        <div className="article-category">{article.category}</div>
                                        <h2 className="uk-card-title"><a href="javascript: void(0);" onClick={() => props.onDisplaySingleArticleContent(article._id)}>{article.title}</a></h2>
                                    </div>

                                    {/* <div className="card-body">
                                        <p className="post-list__excerpt">{article.excerpt}</p>
                                    </div> */}

                                    <div className="card-footer">
                                        <div>
                                            {
                                                article.tags.map((tag: any) => {
                                                    return <a key={tag} href="#" className="post-list__tags">#{tag}</a>
                                                })
                                            }
                                        </div>
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
