import React from 'react';

const ThemeSwitcherDropdownComponent = () => {
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

    return (
        <React.Fragment>
            <a href="#" uk-tooltip="Click this button to view list of available themes.">Themes</a>
            <div className="uk-navbar-dropdown" uk-dropdown="mode: click">
                <ul className="uk-nav uk-navbar-dropdown-nav">
                    <li className="uk-active" onClick={() => switchTheme('light')}><a href="#">Light Theme (Default)</a></li>
                    <li><a href="#" onClick={() => switchTheme('dark')}>Dark Theme</a></li>
                    <li><a href="#" onClick={() => switchTheme('solarized')}>Solarized Theme</a></li>
                    <li><a href="#" onClick={() => switchTheme('solarized-dark')}>Solarized Dark Theme</a></li>
                </ul>
            </div>
        </React.Fragment>
    )
}

export default ThemeSwitcherDropdownComponent;
