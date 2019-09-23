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
            <button className="btn nav-link dropdown-toggle" type="button" id="dropdownMenuTheme" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="Click this button to view list of available themes.">Themes</button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuTheme">
                <a className="dropdown-item" onClick={() => switchTheme('light')}>Light Theme (Default)</a>
                <a className="dropdown-item" onClick={() => switchTheme('dark')}>Dark Theme</a>
                <a className="dropdown-item" onClick={() => switchTheme('solarized')}>Solarized Theme</a>
                <a className="dropdown-item" onClick={() => switchTheme('solarized-dark')}>Solarized Dark Theme</a>
            </div>
        </React.Fragment>
    )
}

export default ThemeSwitcherDropdownComponent;
