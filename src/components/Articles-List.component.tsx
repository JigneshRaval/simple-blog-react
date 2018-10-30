import * as React from "react";
import { ArticleListItem } from './Article-List-Item.component';

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export const ArticlesList = (props: any) => {
    // console.log('Props :', props);
    const isArticleActive = new Array(props.filteredArticles.length);
    // this.isArticleActive = [...new Array(props.filteredArticles.length)].map(x => false); // [0, 0, 0, 0, 0]
    isArticleActive.fill(false, 0, props.filteredArticles.length);

    /* const getArticles = (articleId: any, index: number) => {
        // console.log('Get Articles 123 : ==', props.articleService.getArticlesData());
        props.onDisplaySingleArticleContent(articleId);
        isArticleActive[index] = !isArticleActive[index];

        console.log(isArticleActive, index, isArticleActive[index])
    } */

    return (
        <div className="post-list__wrapper">
            <div className="uk-flex uk-flex-column">
                {
                    props.filteredArticles.map((article: any, index: number) => {
                        return (
                            <ArticleListItem key={index} article={article} index={index} isArticleActive={isArticleActive[index]} {...props} />
                            {/* <div className={"uk-card uk-card-default " + (isArticleActive[index] ? 'active' : '')} key={article._id}>
                                <div className="card" data-category={article.category}>
                                    <div className="card-controls uk-inline">
                                        <button className="uk-button uk-button-link" type="button"><i uk-icon="more-vertical"></i></button>
                                        <div uk-dropdown="mode: click; pos: bottom-right" className="uk-dropdown-bottom-right">
                                            <ul className="uk-nav uk-dropdown-nav">
                                                <li className="uk-active"><a href="javascript:void(0);" onClick={() => props.onEditArticle(article._id, true)}>Edit Article</a></li>
                                                <li><a href="javascript:void(0);" onClick={() => props.onDeleteArticle(article._id)}>Delete Article</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="card-header">
                                        <div className="article-category">{article.category}</div>
                                        <h2 className="uk-card-title"><a href="javascript: void(0);" onClick={() => getArticles(article._id, index)}>{article.title}</a></h2>
                                    </div>
                                    <div className="card-footer">
                                        <div>
                                            {
                                                article.tags.map((tag: any) => {
                                                    return <a key={tag} href="#" className="post-list__tags" data-tag-name={tag} onClick={(event) => props.onFilterArticles(event, 'tag')}>#{tag}</a>
                                                })
                                            }
                                        </div>
                                    </div>

                                </div>
                            </div> */}
                        )
                })
            }
            </div>
        </div>
    );

}
