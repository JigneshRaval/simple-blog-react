import React from "react";

import ArticleHome from './views/ArticlesHome.page';
import BookmarkHome from './views/BookmarksHome.page';

class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <ArticleHome />
                <BookmarkHome />
            </React.Fragment>
        );
    }
}

export default App;
