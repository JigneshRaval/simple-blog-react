import * as React from "react";
// import ArticleListItem from './Article-List-Item.component';
import TagsInline from './Tags-Inline.component';

class ArticlesList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            activeTab: 0
        };

        this.handleActivateTab = this.handleActivateTab.bind(this);
    }

    // Activate / De-activate selected item
    handleActivateTab(index: number) {
        this.setState((prev: number) => ({
            activeTab: prev.activeTab === index ? -1 : index
        }));
    }

    getArticleContent = (articleId: any, index: number) => {
        this.props.onDisplaySingleArticleContent(articleId);
        this.props.onActivateTab(index);
        this.setState({ active: !this.state.active });
    }

    render() {
        const { filteredArticles, onDeleteArticle, onEditArticle } = this.props;

        return (
            <div className="post-list__wrapper" >
                <div className="uk-flex uk-flex-column">
                    {
                        filteredArticles.map((article: any, index: number) => {
                            return (
                                <div className={"uk-card uk-card-default" + (this.state.activeTab === index ? ' active' : '')} key={article._id}>

                <div className="card" data-category={article.category}>
                    <div className="card-controls uk-inline">
                        <button className="uk-button uk-button-link" type="button"><i uk-icon="more-vertical"></i></button>
                        <div uk-dropdown="mode: click; pos: bottom-right" className="uk-dropdown-bottom-right">
                            <ul className="uk-nav uk-dropdown-nav">
                                <li className="uk-active"><a href="javascript:void(0);" onClick={() => onEditArticle(article._id, true)}>Edit Article</a></li>
                                <li><a href="javascript:void(0);" onClick={() => onDeleteArticle(article._id)}>Delete Article</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="card-header">
                        <div className="article-category">{article.category}</div>
                        <h2 className="uk-card-title"><a href="javascript: void(0);" onClick={() => this.getArticleContent(article._id, index)}>{article.title}</a></h2>
                    </div>

                    <div className="card-footer">
                        <div>
                            <TagsInline article={article} onFilterArticles={this.props.onFilterArticles} className={'post-list__tags uk-button uk-button-text'}/>
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
}

export default ArticlesList;

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
