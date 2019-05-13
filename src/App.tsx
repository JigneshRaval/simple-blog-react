import React from "react";

import ArticleHome from './views/ArticlesHome.page';

class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <ArticleHome />
            </React.Fragment>
        );
    }
}

export default App;
