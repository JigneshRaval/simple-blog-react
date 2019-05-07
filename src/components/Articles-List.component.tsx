import React, { useState } from "react";
import ArticleListItem from './Article-List-Item.component';
import TagsInline from './Tags-Inline.component';

const ArticlesList = (props: any) => {
    const [activeTab, setActiveTab] = useState(0);
    /* constructor(props: any) {
        super(props);

        this.state = {
            activeTab: 0
        };

        this.handleActivateTab = this.handleActivateTab.bind(this);

    } */

    // Activate / De-activate selected item
    const handleActivateTab = (index: number) => {
        setActiveTab(activeTab === index ? -1 : index)
        /* this.setState((prev: any) => ({
            activeTab: prev.activeTab === index ? -1 : index
        })); */
    }

    const getArticleContent = (articleId: any, index: number) => {
        props.onDisplaySingleArticleContent(articleId);
        // props.onActivateTab(index);
        // this.setState({ active: !this.state.active });
    }



    // render() {
    const { filteredArticles } = props;
    getArticleContent(filteredArticles[0], 0);
    return (
        <div className="post-list__wrapper" >
            <div className="uk-flex uk-flex-column">
                {
                    filteredArticles && filteredArticles.length > 0 ?
                        filteredArticles.map((article: any, index: number) => {
                            return (
                                <ArticleListItem
                                    key={index}
                                    article={article}
                                    index={index}
                                    activeTab={activeTab}
                                    onActivateTab={handleActivateTab.bind(null, index)}
                                    {...props} />
                            )
                        }) : <div className="message-no-article">Sorry, No article found</div>
                }
            </div>
        </div>
    );
    // }
}

export default ArticlesList;

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
