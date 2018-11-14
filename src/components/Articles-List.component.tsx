import * as React from "react";
import ArticleListItem from './Article-List-Item.component';
import TagsInline from './Tags-Inline.component';

class ArticlesList extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            activeTab: 0
        };

        this.handleActivateTab = this.handleActivateTab.bind(this);
        this.handleToggleArticleListPanel = this.handleToggleArticleListPanel.bind(this);
    }

    // Activate / De-activate selected item
    handleActivateTab(index: number) {
        this.setState((prev: any) => ({
            activeTab: prev.activeTab === index ? -1 : index
        }));
    }

    getArticleContent = (articleId: any, index: number) => {
        this.props.onDisplaySingleArticleContent(articleId);
        this.props.onActivateTab(index);
        this.setState({ active: !this.state.active });
    }

    handleToggleArticleListPanel() {
        if (!document.body.classList.contains('isArticleListPanelOpened')) {
            document.body.classList.add('isArticleListPanelOpened');
        } else {
            document.body.classList.remove('isArticleListPanelOpened');
        }
    }

    render() {
        const { filteredArticles } = this.props;

        return (
            <div className="post-list__wrapper" >
                <div className="uk-flex uk-flex-column">
                    {
                        filteredArticles.map((article: any, index: number) => {
                            return (
                                <ArticleListItem
                                    key={index}
                                    article={article}
                                    index={index}
                                    activeTab={this.state.activeTab}
                                    onActivateTab={this.handleActivateTab.bind(null, index)}
                                    {...this.props} />
                            )
                        })
                    }
                </div>
                <span className="post-list__drawer" onClick={this.handleToggleArticleListPanel}>
                    <i className="ion-ios-arrow-back"></i><i className="ion-ios-arrow-back"></i>
                </span>
            </div>
        );
    }
}

export default ArticlesList;

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
