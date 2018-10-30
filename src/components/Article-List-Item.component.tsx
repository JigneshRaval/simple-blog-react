import React from 'react';

export class ArticleListItem extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            active: false
        }
        console.log('ArticleListItem Props === ', props);
    }

    getArticles = (articleId: any, index: number) => {
        // console.log('Get Articles 123 : ==', props.articleService.getArticlesData());
        this.props.onDisplaySingleArticleContent(articleId);
        this.setState({ active: !this.state.active });
        this.props.isArticleActive = !this.props.isArticleActive;
        // console.log(this.props.isArticleActive, index, this.props.isArticleActive[index])
    }

    render() {
        const { article } = this.props;


        return (
            <div className={"uk-card uk-card-default " + (this.state.active ? 'active' : '')} key={article._id}>

                <div className="card" data-category={article.category}>
                    <div className="card-controls uk-inline">
                        <button className="uk-button uk-button-link" type="button"><i uk-icon="more-vertical"></i></button>
                        <div uk-dropdown="mode: click; pos: bottom-right" className="uk-dropdown-bottom-right">
                            <ul className="uk-nav uk-dropdown-nav">
                                <li className="uk-active"><a href="javascript:void(0);" onClick={() => this.props.onEditArticle(article._id, true)}>Edit Article</a></li>
                                <li><a href="javascript:void(0);" onClick={() => this.props.onDeleteArticle(article._id)}>Delete Article</a></li>
                                {/* <li className="uk-nav-header">Fevorite</li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="card-header">
                        <div className="article-category">{article.category}123 {this.props.isArticleActive}</div>
                        {/* <h2 className="uk-card-title"><a href="javascript: void(0);" onClick={() => props.onDisplaySingleArticleContent(article._id)}>{article.title}</a></h2> */}
                        <h2 className="uk-card-title"><a href="javascript: void(0);" onClick={() => this.getArticles(article._id, this.props.index)}>{article.title}</a></h2>
                    </div>
                    <div className="card-footer">
                        <div>
                            {
                                article.tags.map((tag: any) => {
                                    return <a key={tag} href="#" className="post-list__tags" data-tag-name={tag} onClick={(event) => this.props.onFilterArticles(event, 'tag')}>#{tag}</a>
                                })
                            }
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}
