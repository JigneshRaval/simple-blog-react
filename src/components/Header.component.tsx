import React from 'react';

const Header = () => {
    return (
        <div className="header-main">
            <h5 className="header-title">
                <a id="toggleSidebar" href="javascript:void(0);">&#9776;</a>
                <a href="/">WEBGEMS <span>Developer Resources</span></a>
            </h5>
            <ul className="main-navigation">
                <li><a className="main-navigation__item" href="/">Our Work</a></li>
                <li><a className="main-navigation__item" href="/">Blog</a></li>
                <li><a className="main-navigation__item" href="javascript:void(0)" id="showGrid">About Us</a></li>
                <li><a className="main-navigation__item dropdown-toggle" href="javascript:void(0)" id="toggleTheme" data-toggle="dropdown"
                    aria-haspopup="true" aria-expanded="false">Toggle Theme</a>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#">Default Theme</a>
                        <a className="dropdown-item" href="#">Dark Theme</a>
                        <a className="dropdown-item" href="#">Other Theme</a>
                    </div>
                </li>
                <li><a className="main-navigation__item" href="/html-to-markdown.html">Html To Markdown</a></li>
            </ul>
        </div>
    )
}

export default Header;
