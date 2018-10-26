import React from 'react';

const Header = (props: any) => {
    const openform = () => {
        UIkit.modal('#modal-example').show();
    }

    const clearSearchBox = (event:any) => {
        event.target.value = '';
        // props.onFilterArticles(event, 'all');
    }

    return (
        <header className="header-main uk-container uk-container-expand">
            <nav className="uk-navbar-container uk-navbar-transparent" uk-navbar="">
                <div className="uk-navbar-left">
                    <h5 className="header-title uk-navbar-item">
                        <a href="/">WEBGEMS <span hidden>Developer Resources</span></a>
                    </h5>
                </div>
                <div className="uk-navbar-right">
                    <div className="uk-navbar-item">
                        <form className="uk-search uk-search-default uk-width-1-1">
                            <span uk-search-icon=""></span>
                            <input className="uk-search-input" name="searchBar" id="searchBar" type="text" placeholder="Search articles by Tag, Category etc..." onChange={(event) => props.onFilterArticles(event, 'tag')} onBlur={clearSearchBox} />
                        </form>
                    </div>
                    <ul className="uk-navbar-nav">
                        <li className="uk-active"><a href="#">Our Work</a></li>
                        <li>
                            <a href="#">Themes</a>
                            <div className="uk-navbar-dropdown">
                                <ul className="uk-nav uk-navbar-dropdown-nav">
                                    <li className="uk-active"><a href="#">Default Theme</a></li>
                                    <li><a href="#">Dark Theme</a></li>
                                    <li><a href="#">Other Theme</a></li>
                                </ul>
                            </div>
                        </li>
                        <li><a href="#">Item</a></li>
                    </ul>
                    <button className="uk-button uk-button-secondary" uk-toggle="target: #modal-example" onClick={openform}>Add Article</button>
                    <a id="toggleSidebar" href="#offcanvas-usage" uk-toggle="">&#9776;</a>
                </div>
            </nav>
        </header>
    )
}

export default Header;
