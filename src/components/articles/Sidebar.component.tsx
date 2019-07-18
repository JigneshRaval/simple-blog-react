// Sidebar.component.tsx

// Sidebar component : which displays list of Categories and Tags

import React, { Component } from 'react';

import Tags from '../shared/Tags.component';

const Sidebar = (props: any) => {

    return (
        <React.Fragment>

            <Tags {...props} />

        </React.Fragment>
    )
}

export default Sidebar;
