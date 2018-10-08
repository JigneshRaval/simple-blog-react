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
import { EditArticleFormComponent } from './components/Edit-Article-Form.component';

export class App extends React.Component<any, any> {
    articleService: ArticleService;

    constructor(props: any) {
        super(props);
        this.articleService = new ArticleService();

        this.state = {
            articles: [],
            isEditMode: false,
            articleCount: 0,
            editData: {}
        };
    }

    componentDidMount() {
        // Render all Articles on component mount
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

    // Delete single article by articleId
    handleDeleteArticle = (articleId: string): void => {
        this.articleService.deleteArticle(articleId).then((data: any) => {
            this.setState({ articles: data.docs });
            console.log(this.state, data);
        });
    }

    handleCreateArticle = (formDataObj: any) => {
        let articles = [...this.state.articles];

        this.articleService.createArticle(formDataObj).then((data: any) => {
            articles.push(data.newDoc)
            this.setState({ articles: articles });
            console.log(this.state, data);
        });
    }

    handleEditArticle = (articleId: string) => {
        this.articleService.getArticleById(articleId).then(data => {
            this.setState({ editData: data.docs[0] });
            console.log(this.state);
        });
    }

    handleEditSaveArticle = (articleId: string, formDataObj: any) => {
        let articles = [...this.state.articles];

        this.articleService.editArticle(articleId, formDataObj).then((data: any) => {
            /* articles.push(data.newDoc)
            this.setState({ articles: articles }); */
            console.log(this.state, data);
        });
    }

    render() {
        return (
            <React.Fragment>
                <Articles {...this.state} onDeleteArticle={this.handleDeleteArticle} onEditArticle={this.handleEditArticle} />
                <CreateArticleFormComponent onCreateArticle={this.handleCreateArticle} />
                <EditArticleFormComponent editData={this.state.editData} onEditSaveArticle={this.handleEditSaveArticle}/>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
