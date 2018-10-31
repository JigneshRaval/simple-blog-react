// Article-List-Item.component.tsx

// Single item in the list

import React from 'react';
import TagsInline from './Tags-Inline.component';

class ArticleListItem extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            isActive: this.props.activeTab
        }
        // console.log('ArticleListItem Props === ', props);
    }

    getArticles = (articleId: any, index: number) => {
        this.props.onDisplaySingleArticleContent(articleId);
        this.props.onActivateTab(index);
        this.setState({ active: !this.state.active });
    }

    render() {
        const { article, onDeleteArticle, onEditArticle, activeTab, index } = this.props;

        return (
            <div className={"uk-card uk-card-default" + (activeTab === index ? ' active' : '')} key={article._id}>

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
                        <h2 className="uk-card-title"><a href="javascript: void(0);" onClick={() => this.getArticles(article._id, this.props.index)}>{article.title}</a></h2>
                    </div>

                    <div className="card-footer">
                        <div>
                            <TagsInline article={article} onFilterArticles={this.props.onFilterArticles} className={'post-list__tags uk-button uk-button-text'}/>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default ArticleListItem;
