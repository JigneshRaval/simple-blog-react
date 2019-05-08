// Header.component.tsx

// This component contains Header items like Logo, Search-bar, Navigation etc.

import React from 'react';
import ArticleContext from '../services/context';
import Utils from '../services/utils';
import SearchComponent from './Search.component';
import ThemeSwitcherDropdownComponent from './ThemeDropdown.component';
const utils = new Utils;

declare var UIkit: any;

const Header = (props: any) => {

    // Open Create Article form in modal overlay
    const openform = () => {
        UIkit.modal('#modal-example').show();
    }

    /**
     * @function : Toggle Sidebar Panel containing list of Articles
     * @param event
     */
    const handleToggleArticleListPanel = () => {
        if (!document.body.classList.contains('isArticleListPanelOpened')) {
            document.body.classList.add('isArticleListPanelOpened');
            if ('localStorage' in window && window['localStorage'] !== null) {
                localStorage.setItem('isArticleListPanelOpened', 'true');
            }
        } else {
            document.body.classList.remove('isArticleListPanelOpened');
            if ('localStorage' in window && window['localStorage'] !== null) {
                localStorage.setItem('isArticleListPanelOpened', 'false');
            }
        }
    }

    return (
        <ArticleContext.Consumer>
            {
                ({ state, actions }) => (
                    <header className="header-main uk-container uk-container-expand">
                        <nav className="uk-navbar-container uk-navbar-transparent" uk-navbar="">
                            <div className="uk-navbar-left">
                                <button className="post-list__drawer" onClick={handleToggleArticleListPanel} title="Click this button to view list of Articles." uk-tooltip="Click this button to view list of Articles.">
                                    <i className="ion ion-ios-arrow-forward"></i><i className="ion ion-ios-arrow-forward"></i>
                                </button>
                            </div>
                            <div className="uk-navbar-left">
                                <h5 className="header-title uk-navbar-item">
                                    <a href="/">
                                        <img src="../assets/images/Logo-iconic-thick.svg" alt="Code candy logo" className="logo-iconic" data-color-old="#9345EB" />
                                        <img src="../assets/images/Logo-textual-product-sans.svg" alt="Code candy logo" className="logo-textual" />
                                    </a>
                                </h5>
                            </div>
                            <div className="uk-navbar-right">
                                <div className="uk-navbar-item">
                                    <SearchComponent onFilterArticles={actions.onFilterArticles} />
                                </div>

                                {/* START : Dropdown Navigation */}
                                <ul className="uk-navbar-nav" >
                                    <li className="uk-active">
                                        <a href="#">Categories</a>
                                        <div className="uk-navbar-dropdown" uk-dropdown="mode: click">
                                            <ul className="uk-nav uk-navbar-dropdown-nav">
                                                <li>
                                                    <a href="javascript: void(0);" data-tag-name='all' onClick={(event) => actions.onFilterArticles(event, 'all')}>View All Articles</a>
                                                </li>
                                                {
                                                    utils.getUniqueCategories(state).map((category: any, index: number) => {
                                                        return (
                                                            <li key={category}>
                                                                <a href="javascript: void(0);" data-tag-name={category} onClick={(event) => actions.onFilterArticles(event, 'category')}>{category}</a>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <ThemeSwitcherDropdownComponent />
                                    </li>
                                    <li>
                                        <a href="#offcanvas-usage" uk-toggle="" title="Click this button to view list of Categories and Tags." uk-tooltip="Click this button to view list of Categories and Tags.">Tags</a>
                                    </li>
                                </ul>
                                {/* END : Dropdown Navigation */}

                                <button className="uk-button uk-button-secondary" uk-toggle="target: #modal-example" onClick={openform}>Create Article</button>
                                <a id="toggleSidebar" href="#offcanvas-usage" uk-toggle="" title="Click this button to view list of Categories and Tags." uk-tooltip="Click this button to view list of Categories and Tags."><i className="ion ion-md-menu"></i></a>
                            </div>
                        </nav>
                    </header>
                )
            }
        </ArticleContext.Consumer>
    );

}

export default Header;
