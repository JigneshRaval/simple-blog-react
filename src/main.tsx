// ./src/main.tsx

// REACT
import * as React from "react";
import * as ReactDOM from "react-dom";

import './assets/styles/main.scss';

import './vendor.ts';

// SERVICES
import { ArticleService } from "./services/articles.service";

// COMPONENTS
import Header from "./components/Header.component";
// import Tags from "./components/Tags.component";
// import Categories from "./components/Categories.component";
import Sidebar from './components/Sidebar.component';
import { ArticlesList } from "./components/Articles-List.component";
import { Article } from "./components/Article.component";
import { CreateArticleFormComponent } from './components/Create-Article-Form.component';
/*
import HOC from './components/HOC-examples/HOC.component';
import UserName from './components/HOC-examples/username.component';

const HOCDemo = HOC(UserName);
*/

export class App extends React.Component<any, any> {
    articleService: ArticleService;

    constructor(props: any) {
        super(props);
        this.articleService = new ArticleService();

        this.state = {
            articles: [],
            filteredArticles: [],
            isEditMode: false,
            articleCount: 0,
            editData: {},
            currentArticle: '',
            showForm: false,
            articleService: this.articleService
        };
    }

    componentDidMount() {
        // Render all Articles on component mount
        this.articleService.getAllArticles()
            .then((data) => {
                this.setState({ articles: data.docs, articleCount: data.docs.length, filteredArticles: data.docs, currentArticle: data.docs[0] });

                // Update variable value in articles.service.ts
                this.updateArticleDataService(this.state.articles);
            })
            .catch((err) => {
                console.log('Error in fetching all reacords', err);
            });
    }


    // Create new article
    // =========================================
    handleCreateArticle = (formDataObj: any) => {
        this.articleService.createArticle(formDataObj).then((data: any) => {

            let articles = [data.newDoc, ...this.state.articles];

            this.setState({ articles, filteredArticles: articles });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Display Single Article Content
    // =========================================
    handleDisplaySingleArticleContent = (articleId: string) => {
        this.state.articles.map((article: any, index: number) => {
            if (article._id === articleId) {
                this.setState({ currentArticle: article });
            }
        });
    }


    // Get Article data on click of Edit button
    // =========================================
    handleEditArticle = (articleId: string, isFormVisible: boolean) => {
        UIkit.modal('#modal-example').show();
        this.setState({ isEditMode: true, showForm: isFormVisible });
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

            this.setState({ articles: articles, filteredArticles: articles, editData: {}, isEditMode: false });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Delete single article by articleId
    // =========================================
    handleDeleteArticle = (articleId: string): void => {
        this.articleService.deleteArticle(articleId).then((data: any) => {
            this.setState({ articles: data.docs, filteredArticles: data.docs });

            // Update variable value in articles.service.ts
            this.updateArticleDataService(this.state.articles);
        });
    }


    // Filter all the articles by Tag, Category or the search value provided by the user
    // =========================================
    handleFilterArticles = (event: any, filterBy: string) => {
        let filteredList: any = [];
        let searchBarElem = document.querySelector('#searchBar');
        let searchTerm = event.target.value || event.target.getAttribute('data-tag-name')

        console.log('searchBarElem :', searchBarElem);

        if (searchTerm) {

            switch (filterBy) {
                case 'tag':
                    // Method 1: filter articles by tags matching with search term
                    let articleByTags = this.state.articles.filter(({ tags }: any) => {
                        return tags.some((tag: any) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                    });

                    filteredList = [...articleByTags];
                    break;
                case 'category':
                    // Method 1: filter articles by tags matching with search term
                    let articlesByCategory = this.state.articles.filter(({ category }: any) => {
                        return category.toLowerCase().includes(searchTerm.toLowerCase())
                    });

                    filteredList = [...articlesByCategory];
                    break;
                default:
                    this.state.articles.map((article: any) => {
                        if (article[filterBy].indexOf(searchTerm) > -1) {
                            filteredList.push(article);
                        }
                    });
            }

            // If "searchTerm" provided then, Set filtered articles in the state
            this.setState({ filteredArticles: filteredList });
        } else {
            // If "searchTerm" NOT provided then, Set default articles list into the filtered articles in the state
            this.setState({ filteredArticles: this.state.articles });
        }
    }


    // Update variable value in articles.service.ts
    // =========================================
    updateArticleDataService = (data: any) => {
        this.articleService.setArticlesData(data);
    }

    handleToggleFormDisplay = (isFormVisible: boolean) => {
        this.setState({ showForm: isFormVisible });
    }

    render() {
        return (
            <React.Fragment>
                <main className="wrapper uk-offcanvas-content">
                    <div className="container-fluid">

                        {/* <aside className="sidebar-panel">

                            <Sidebar onFilterArticles={this.handleFilterArticles} onShowAddEditForm={this.handleToggleFormDisplay} {...this.state} />

                        </aside> */}

                        <section className="content-wrapper">

                            <Header onFilterArticles={this.handleFilterArticles} />

                            <section className="content-section">
                                {/* If "showform"=true then display Create form else show list items */}
                                <CreateArticleFormComponent
                                    {...this.state}
                                    onCreateArticle={this.handleCreateArticle}
                                    onEditSaveArticle={this.handleEditSaveArticle}
                                    onToggleAddEditForm={this.handleToggleFormDisplay} />

                                <ArticlesList {...this.state}
                                    onDeleteArticle={this.handleDeleteArticle}
                                    onEditArticle={this.handleEditArticle}
                                    onDisplaySingleArticleContent={this.handleDisplaySingleArticleContent}
                                    onFilterArticles={this.handleFilterArticles}
                                />

                                {
                                    this.state.currentArticle ? (
                                        <Article currentArticle={this.state.currentArticle} onFilterArticles={this.handleFilterArticles} />
                                    ) : ''
                                }

                            </section>
                        </section>
                    </div>
                    <div id="offcanvas-usage" uk-offcanvas="flip:true">
                        <div className="uk-offcanvas-bar">

                            <button className="uk-offcanvas-close" type="button" uk-close=""></button>

                            <h3>Categories</h3>

                            <Sidebar onFilterArticles={this.handleFilterArticles} onShowAddEditForm={this.handleToggleFormDisplay} {...this.state} />

                        </div>
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
