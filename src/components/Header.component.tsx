import React from 'react';

const Header = (props: any) => {
    return (


        <nav className="uk-navbar-container" uk-navbar="">
            <div className="uk-navbar-left">
                <h5 className="header-title uk-navbar-item">
                    <a href="/">WEBGEMS <span hidden>Developer Resources</span></a>
                </h5>

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
            </div>
            <div className="uk-navbar-right">
                <div>
                    <a className="uk-navbar-toggle" uk-search-icon="" href="#"></a>
                    <div className="uk-drop" uk-drop="mode: click; pos: left-center; offset: 0">
                        <form className="uk-search uk-search-navbar uk-width-1-1">
                            <input className="uk-search-input" type="text" placeholder="Search articles by Tag, Category etc..." onChange={(event) => props.onFilterArticles(event, 'tag')} />
                        </form>
                    </div>
                </div>
                <a id="toggleSidebar" href="#offcanvas-usage" uk-toggle="">&#9776;</a>
            </div>
        </nav>
    )
}

export default Header;
