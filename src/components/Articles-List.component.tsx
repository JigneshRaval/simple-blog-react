import React, { useState } from "react";
import ArticleListItem from './Article-List-Item.component';
import LoadingSpinner from './loadingSpinner';
// import TagsInline from './Tags-Inline.component';

const ArticlesList = (props: any) => {
    const [activeTab, setActiveTab] = useState(0);

    // Activate / De-activate selected item
    const handleActivateTab = (index: number) => {
        setActiveTab(activeTab === index ? -1 : index);
    }

    const { filteredArticles, loading } = props;

    return (
        <div className="post-list__wrapper" >
            <div className="uk-flex uk-flex-column">
                {
                    loading ? <LoadingSpinner /> : filteredArticles && filteredArticles.length > 0 ?
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
}

export default ArticlesList;

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
