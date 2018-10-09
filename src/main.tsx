// ./src/main.tsx

// REACT
import * as React from "react";
import * as ReactDOM from "react-dom";

import './assets/styles/main.scss';

// SERVICES
import { ArticleService } from "./services/articles.service";

// COMPONENTS
import Header from "./components/Header.component";
import Tags from "./components/Tags.component";
import Categories from "./components/Categories.component";
import { ArticlesList } from "./components/Articles-List.component";
import { Article } from "./components/Article.component";
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
            editData: {},
            currentArticle: ''
        };
    }

    componentDidMount() {
        console.log('Get Articles : ==', this.articleService.getArticles());
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
        this.setState({ isEditMode: true });
        this.articleService.getArticleById(articleId).then(data => {
            this.setState({ editData: data.docs[0] });
            console.log(this.state);
        });
    }

    handleEditSaveArticle = (articleId: string, formDataObj: any) => {
        let articles = [...this.state.articles];

        this.articleService.editArticle(articleId, formDataObj).then((data: any) => {
            articles.map((article, index) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                    console.log('handleEditSaveArticle : ==', this.state, data);
                }
            });
            this.setState({ articles, editData: {}, isEditMode: false });
        });
    }

    handleDisplaySingleArticleContent = (articleId: string) => {
        this.state.articles.map((article: any, index: number) => {
            if (article._id === articleId) {
                this.setState({ currentArticle: article });
            }
        });
    }

    handleFilterArticles = (filterBy: string, filterValue: any) => {
        let filteredList: any = []

        this.state.articles.map((article: any) => {
            if (article.tags.includes(filterValue)) {
                filteredList.push(article);
            }
        });

        // this.setState({ articles: filteredList });
    }

    render() {
        return (
            <React.Fragment>
                <main className="wrapper">
                    <div className="container-fluid">

                        <aside className="sidebar-panel">

                            <Categories {...this.state} />

                            <Tags {...this.state} onFilterArticles={this.handleFilterArticles} />

                        </aside>

                        <section className="content-wrapper">

                            <Header />

                            <ArticlesList {...this.state}
                                onDeleteArticle={this.handleDeleteArticle}
                                onEditArticle={this.handleEditArticle}
                                onDisplaySingleArticleContent={this.handleDisplaySingleArticleContent}
                            />

                            <CreateArticleFormComponent
                                {...this.state}
                                onCreateArticle={this.handleCreateArticle}
                                onEditSaveArticle={this.handleEditSaveArticle} />

                            <Article currentArticle={this.state.currentArticle} />
                        </section>
                    </div>
                </main>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);
