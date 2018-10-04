// ./src/main.tsx

// REACT
import * as React from "react";
import * as ReactDOM from "react-dom";

import './assets/styles/main.scss';

// SERVICES
import { ArticleService } from "./services/articles.service";

// COMPONENTS
import { Articles } from "./components/Articles.component";
import { CreateArticleFormComponent } from './components/Create-Article-Form.component';

export class App extends React.Component {
    articleService: ArticleService;

    constructor(props: any) {
        super(props);
        this.articleService = new ArticleService();

        this.state = {
            articles: [],
            isEditMode: false,
            articleCount: 0,
            articleService: this.articleService
        };
    }

    componentDidMount() {
        // Render all Articles on component render
        this.articleService.getAllArticles()
            .then((data) => {
                console.log(data);
                this.setState({ articles: data.docs, articleCount: data.docs.length });
                console.log(this.state);
            })
            .catch((err) => {
                console.log('Error in fetching all reacords', err);
            });
    }

    render() {
        return (
            <React.Fragment>
                <Articles {...this.state} />
                <CreateArticleFormComponent />
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
