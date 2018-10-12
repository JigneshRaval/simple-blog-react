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
            currentArticle: '',
            articleService: this.articleService,
            serachText: '',
            filteredArticles: []
        };
    }

    componentDidMount() {
        // Render all Articles on component mount
        this.articleService.getAllArticles()
            .then((data) => {
                this.setState({ articles: data.docs, articleCount: data.docs.length, filteredArticles: data.docs });

                // Update variable value in articles.service.ts
                this.updateArticleDataService(this.state.articles);
            })
            .catch((err) => {
                console.log('Error in fetching all reacords', err);
            });
    }


    // Delete single article by articleId
    // =========================================
    handleDeleteArticle = (articleId: string): void => {
        this.articleService.deleteArticle(articleId).then((data: any) => {
            this.setState({ articles: data.docs });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Create new article
    // =========================================
    handleCreateArticle = (formDataObj: any) => {
        let articles = [...this.state.articles];

        this.articleService.createArticle(formDataObj).then((data: any) => {
            articles.push(data.newDoc)
            this.setState({ articles: articles });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Get Article data on click of Edit button
    // =========================================
    handleEditArticle = (articleId: string) => {
        this.setState({ isEditMode: true });
        this.state.articles.map((article: any) => {
            if (article._id === articleId) {
                this.setState({ editData: article });
            }
        });
        /* this.articleService.getArticleById(articleId).then(data => {
            this.setState({ editData: data.docs[0] });
        }); */
    }


    // Update data on the server
    // =========================================
    handleEditSaveArticle = (articleId: string, formDataObj: any) => {
        let articles = [...this.state.articles];

        this.articleService.editArticle(articleId, formDataObj).then((data: any) => {
            articles.map((article, index) => {
                if (article._id === data.docs[0]._id) {
                    articles[index] = { ...data.docs[0] };
                    articles[index] = data.docs[0];
                }
            });

            this.setState({ articles, editData: {}, isEditMode: false });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Display Article Content
    // =========================================
    handleDisplaySingleArticleContent = (articleId: string) => {
        this.state.articles.map((article: any, index: number) => {
            if (article._id === articleId) {
                this.setState({ currentArticle: article });
            }
        });
    }


    // Filter articles by Tag or Category
    // =========================================
    handleFilterArticles = (filterBy: string, event: any, ) => {
        let filteredList: any = [];


        if (filterBy === 'tag') {
            this.state.articles.reduce((newArticles: any, article: any) => {
                // let test1 = [];
                if (article.tags) {
                    article.tags.map(tag => {
                        if (tag && tag.toLowerCase().indexOf(event.target.value) === -1) {
                            newArticles.push(article);
                            // return article;
                        }
                    });
                } else {
                    // newArticles.push(article);
                }

                console.log('test1 =', newArticles);
                return newArticles;
            }, []);
        } else {
            this.state.articles.map((article: any) => {
                if (article[filterBy].indexOf(event.target.value) > -1) {
                    filteredList.push(article);
                }
            });
        }

        console.log('filteredList :', filteredList)

        this.setState({ filteredArticles: filteredList });
    }

    filterList = (event: any) => {
        console.log(event);
        let filteredList: any = []

        this.state.articles.map((article: any) => {
            if (article.tags.includes(this.state.serachText)) {
                filteredList.push(article);
            }
        });

        this.setState({ filteredArticles: filteredList });
    }

    // Update variable value in articles.service.ts
    // =========================================
    updateArticleDataService = (data: any) => {
        this.articleService.setArticlesData(data);
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
                            <input type="text" placeholder="Search" onChange={(e) => this.handleFilterArticles('tag', e)} />
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
