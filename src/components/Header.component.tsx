import React from 'react';

const Header = (props: any) => {
    return (
        <header className="navbar header-main">
            <section className="navbar-section">
                <h5 className="header-title">
                    <a id="toggleSidebar" href="javascript:void(0);">&#9776;</a>
                    <a href="/">WEBGEMS <span>Developer Resources</span></a>
                </h5>
            </section>
            <section className="navbar-section">
                <div className="input-group input-inline">
                    <input className="form-input" type="text" placeholder="Search articles by Tag, Category etc..." onChange={(event) => props.onFilterArticles(event, 'tag')} />
                    <button className="btn btn-primary input-group-btn">Search</button>
                </div>
            </section>
            <section className="navbar-section">
                <ul className="main-navigation">
                    <li><a className="main-navigation__item" href="/">Our Work</a></li>
                    <li><a className="main-navigation__item" href="/">Blog</a></li>
                    <li><a className="main-navigation__item" href="javascript:void(0)" id="showGrid">About Us</a></li>
                    <li className="dropdown"><a className="main-navigation__item dropdown-toggle" href="javascript:void(0)" id="toggleTheme" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">Toggle Theme <i className="icon icon-caret"></i></a>
                        <div className="menu dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#">Default Theme</a>
                            <a className="dropdown-item" href="#">Dark Theme</a>
                            <a className="dropdown-item" href="#">Other Theme</a>
                        </div>
                    </li>
                </ul>
            </section>
        </header>
    )
}

export default Header;
