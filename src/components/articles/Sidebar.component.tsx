// Sidebar.component.tsx

// Sidebar component : which displays list of Categories and Tags

import React, { Component } from 'react';

import Tags from '../shared/Tags.component';

const Sidebar = (props: any) => {

    return (
        <div id="offcanvas-usage" className="offcanvas-panel">
            <div className="offcanvas-bar">
                <button type="button" className="offcanvas-close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>

                <Tags {...props} />

            </div>
        </div>
    )
}

export default Sidebar;
