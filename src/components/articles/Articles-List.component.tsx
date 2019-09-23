import React, { useState, useEffect, Fragment } from "react";
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
    if (!filteredRecords) return null;
    if (loading) return (<LoadingSpinner text={'Loading articles...'} />);
    if (!filteredRecords.length && !loading) return (<div className="message-no-article">Sorry, No article found</div>);

    return (
        <Fragment>
            {
                filteredRecords.map((article: any, index: number) => {
                    return (
                        <ArticleListItem
                            key={article._id}
                            article={article}
                            index={index}
                            activeTab={activeTab}
                            onActivateTab={handleActivateTab.bind(null, index)}
                            {...props} />
                    )
                })
            }
        </Fragment>
    );
}

export default ArticlesList;

// export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
