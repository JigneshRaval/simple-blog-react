// Sidebar.component.tsx

// Sidebar component : which displays list of Categories and Tags

import React, { Component } from 'react';

import Tags from '../shared/Tags.component';

const Sidebar = (props: any) => {

    const showOffCanvas = () => {
        if (document.body.classList.contains('offCanvasVisible')) {
            document.body.classList.remove('offCanvasVisible');
        } else {
            document.body.classList.add('offCanvasVisible');
        }
    }

    return (
        <div id="offcanvas-usage" className="offcanvas-panel">
            <div className="offcanvas-bar">
                <button type="button" className="offcanvas-close close ml-2 mb-1" data-dismiss="modal" aria-label="Close" onClick={showOffCanvas}>
                    <span aria-hidden="true">&times;</span>
                    <span className="sr-only">Close</span>
                </button>

                <Tags {...props} />

            </div>
        </div>
    )
}

export default Sidebar;
