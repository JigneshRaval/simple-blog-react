import * as React from "react";
import ArticleListItem from './Article-List-Item.component';

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
            </div>
        );
    }
}

export default ArticlesList;

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
