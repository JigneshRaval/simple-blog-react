import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

// PAGES
// =======================
import ArticleHome from './views/ArticlesHome.page';
import BookmarkHome from './views/BookmarksHome.page';
import NoMatch from "./routers/NoMatch.component";


class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        // navigator.serviceWorker.getRegistration().then(function(r){r.unregister();});
    }

    render() {
        return (
            <Router>
                <React.Fragment>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/articles" />} />
                        <Route path="/articles" render={() => <ArticleHome type="articles" />} />
                        <Route path="/bookmarks" render={() => <BookmarkHome type="bookmarks" />} />
                        <Route path="*" component={NoMatch} />
                    </Switch>
                </React.Fragment>
            </Router>
        );
    }
}

export default App;
