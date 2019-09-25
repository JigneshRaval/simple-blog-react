// Header.component.tsx

// This component contains Header items like Logo, Search-bar, Navigation etc.

import React from 'react';
import { Link } from "react-router-dom";

import ArticleContext from '../../services/context';
import Utils from '../../services/utils';
import SearchComponent from './Search.component';
import ThemeSwitcherDropdownComponent from './ThemeDropdown.component';
const utils = new Utils;

// declare var UIkit: any;

const Header = (props: any) => {
    console.log('HEader :', props);

    // Open Create Article form in modal overlay
    /* const openForm = () => {
        UIkit.modal('#modal-articles').show();
    }

    const openBookmarkForm = () => {
        UIkit.modal('#modal-bookmarks').show();
    } */

    const showOffCanvas = () => {
        if (document.body.classList.contains('offCanvasVisible')) {
            document.body.classList.remove('offCanvasVisible');
        } else {
            document.body.classList.add('offCanvasVisible');
        }
    }

    return (

        <header className="header-main">
            <nav className="[ navbar navbar-expand-lg navbar-light bg-light ] [ d-flex align-items-stretch ]">
                <button className="post-list__drawer" onClick={utils.handleToggleArticleListPanel} title="Click this button to view list of Articles." uk-tooltip="Click this button to view list of Articles.">
                    <i className="cc-bx-chevrons-right"></i>
                </button>

                {/* START : Logo */}
                <div className="navbar-brand">
                    <h5 className="header-title">
                        <a href="/">
                            <img src="../assets/images/Logo-iconic-thick.svg" alt="Code candy logo" className="logo-iconic" data-color-old="#9345EB" />
                            <img src="../assets/images/Logo-textual-product-sans.svg" alt="Code candy logo" className="logo-textual" />
                        </a>
                    </h5>
                </div>
                {/* END : Logo */}

                {/* START : Toggle/Collapse navigation in Mobile device view */}
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {/* END : Toggle/Collapse navigation in Mobile device view */}

                <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">

                    <SearchComponent onFilterRecords={props.onFilterRecords} />

                    {/* START : Dropdown Navigation */}
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <button type="button" className="btn nav-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdownCategories" title="Click this button to show list of categories.">Categories</button>
                            <div className="dropdown-menu dropdown-categories" aria-labelledby="dropdownCategories">
                                <ul>
                                    <li className="dropdown-item">
                                        <a href="javascript: void(0);" data-tag-name='all' onClick={(event) => props.onFilterRecords(event, 'all')}>View All Articles</a>
                                    </li>
                                    {
                                        utils.getUniqueCategories(props.articles).map((category: any, index: number) => {
                                            return (
                                                <li key={category} className="dropdown-item">
                                                    <a href="javascript: void(0);" data-tag-name={category} onClick={(event) => props.onFilterRecords(event, 'category')}>{category}</a>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <ThemeSwitcherDropdownComponent />
                        </li>

                        {
                            props.type && props.type === 'articles' ? <li className="nav-item nav-link"><Link to="/bookmarks">Bookmarks</Link></li> : <li className="nav-item nav-link"><Link to="/articles">Articles</Link></li>
                        }

                        <li className="nav-item">
                            <a href="#offcanvas-usage" className="nav-item nav-link" title="Click this button to view list of Categories and Tags." onClick={showOffCanvas}>Tags</a>
                        </li>
                    </ul>
                    {/* END : Dropdown Navigation */}

                    {
                        props.type && props.type === 'articles' ? <button className="btn btn-primary" data-toggle="modal" data-target="#modal-articles" onClick={props.onResetEditMode}>Create Article</button> : <button className="btn btn-primary" data-toggle="modal" data-target="#modal-bookmarks">Create Bookmark</button>
                    }

                    <a id="toggleSidebar" href="#offcanvas-usage" title="Click this button to view list of Categories and Tags." onClick={showOffCanvas}><i className="cc-bx-menu"></i></a>
                </div>

            </nav>
        </header>

    );

}

export default Header;
