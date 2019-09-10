// Sidebar.component.tsx

// Sidebar component : which displays list of Categories and Tags

import React, { Component } from 'react';

import Tags from '../shared/Tags.component';

const Sidebar = (props: any) => {

    return (
        <div id="offcanvas-usage" uk-offcanvas="flip: true; overlay: true">
            <div className="uk-offcanvas-bar">
                <button className="uk-offcanvas-close" type="button" uk-close=""></button>

                <Tags {...props} />

            </div>
        </div>
    )
}

export default Sidebar;
