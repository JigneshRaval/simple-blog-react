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
    }

    getArticleContent = (articleId: any, index: number) => {
        this.props.onDisplaySingleArticleContent(articleId);
        this.props.onActivateTab(index);
        this.setState({ active: !this.state.active });
    }

    render() {
        const { article, onDeleteArticle, onEditArticle, onFilterArticles, activeTab, index } = this.props;

        return (
            <div className={"uk-card uk-card-default" + (activeTab === index ? ' active' : '')} key={article._id}>

                <div className="card" data-category={article.category}>
                    <div className="card-controls uk-inline">
                        <button className="uk-button uk-button-link" type="button"><i uk-icon="more-vertical"></i></button>
                        <div uk-dropdown="mode: click; pos: bottom-right" className="uk-dropdown-bottom-right">
                            <ul className="uk-nav uk-dropdown-nav">
                                <li className="uk-nav-header">Actions</li>
                                <li className="uk-active"><a href="javascript:void(0);" onClick={() => onEditArticle(article._id, true)}><span uk-icon="pencil"></span> Edit Article</a></li>
                                <li><a href="javascript:void(0);" onClick={() => onDeleteArticle(article._id)}><span uk-icon="trash"></span> Delete Article</a></li>
                                <li className="uk-nav-header">Tags</li>
                                <TagsInline article={article} onFilterArticles={this.props.onFilterArticles} />
                                <li><a href="javascript:void(0);" onClick={(event) => onFilterArticles(event, 'all')}>Clear filter</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="card-header">
                        <div className="article-category">{article.category}</div>
                        <h2 className="uk-card-title"><a href="javascript: void(0);" onClick={() => this.getArticleContent(article._id, index)}>{article.title}</a></h2>
                    </div>

                    <div className="card-footer">
                        <div>

                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default ArticleListItem;
