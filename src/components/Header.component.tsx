// Header.component.tsx

// This component contains Header items like Logo, Search-bar, Navigation etc.

import React from 'react';

import Utils from '../services/utils';
const utils = new Utils;

declare var UIkit: any;

const Header = (props: any) => {

    // Open Create Article form in modal overlay
    const openform = () => {
        UIkit.modal('#modal-example').show();
    }

    // Clear search-box on click of clear button and display all articles
    const clearSearchBox = (event: any) => {
        const searchBox: any = document.querySelector('#searchBar');
        searchBox.value = '';
        props.onFilterArticles(event, 'all');
    }

    /**
     * @function : Toggle/Switch Themes ( Light, Dark, Solarized)
     * @param themeName : string - Name of the theme ( Light, Dark, Solarized)
     */
    const switchTheme = (themeName: string) => {
        const body = document.querySelector('body');
        body.classList.remove('light', 'dark', 'solarized', 'solarized-dark');
        body.classList.add(themeName);
        if ('localStorage' in window && window['localStorage'] !== null) {
            localStorage.setItem('theme', themeName);
        }
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
                        <form className="uk-search uk-search-default uk-width-1-1">
                            <span uk-search-icon=""></span>
                            <input className="uk-search-input" name="searchBar" id="searchBar" type="text" placeholder="Search articles by Title, Tag or Category" onChange={(event) => props.onFilterArticles(event, 'search')} />
                            <button type="button" className="close clear-search" data-dismiss="modal" aria-label="Close" onClick={clearSearchBox} title="Clear Search">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </form>
                        <button className="ad2hs-prompt uk-button uk-button-primary">Add to Home</button>
                    </div>

                    {/* START : Dropdown Navigation */}
                    <ul className="uk-navbar-nav" >
                        <li className="uk-active"><a href="#">Categories</a>
                            <div className="uk-navbar-dropdown" uk-dropdown="mode: click">
                                <ul className="uk-nav uk-navbar-dropdown-nav">
                                    <li>
                                        <a href="javascript: void(0);" data-tag-name='all' onClick={(event) => props.onFilterArticles(event, 'all')}>View All Articles</a>
                                    </li>
                                    {
                                        utils.getUniqueCategories(props.articles).map((category: any, index: number) => {
                                            return (
                                                <li key={category}>
                                                    <a href="javascript: void(0);" data-tag-name={category} onClick={(event) => props.onFilterArticles(event, 'category')}>{category}</a>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </li>
                        <li>
                            <a href="#" uk-tooltip="Click this button to view list of available themes.">Themes</a>
                            <div className="uk-navbar-dropdown" uk-dropdown="mode: click">
                                <ul className="uk-nav uk-navbar-dropdown-nav">
                                    <li className="uk-active" onClick={() => switchTheme('light')}><a href="#">Light Theme (Default)</a></li>
                                    <li><a href="#" onClick={() => switchTheme('dark')}>Dark Theme</a></li>
                                    <li><a href="#" onClick={() => switchTheme('solarized')}>Solarized Theme</a></li>
                                    <li><a href="#" onClick={() => switchTheme('solarized-dark')}>Solarized Dark Theme</a></li>
                                </ul>
                            </div>
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

export default Header;
