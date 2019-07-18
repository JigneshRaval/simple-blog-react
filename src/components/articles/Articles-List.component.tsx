import React, { useState, useEffect } from "react";
import ArticleListItem from './Article-List-Item.component';
import LoadingSpinner from '../shared/LoadingSpinner';

const ArticlesList = (props: any) => {
    const [activeTab, setActiveTab] = useState(0);

    // Activate / De-activate selected item
    const handleActivateTab = (index: number) => {
        // setActiveTab(activeTab === index ? -1 : index);
        setActiveTab(index);
    }

    const { filteredRecords, loading } = props;

    return (
        <div className="post-list__wrapper" >
            <div className="uk-flex uk-flex-column">
                {
                    loading ? <LoadingSpinner text={'Loading articles...'} /> : filteredRecords && filteredRecords.length > 0 ?
                        filteredRecords.map((article: any, index: number) => {
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
