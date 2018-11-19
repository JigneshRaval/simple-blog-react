// Sidebar.component.tsx

// Sidebar component : which displays list of Categories and Tags

import React, { Component } from 'react';

import Categories from './Categories.component';
import Tags from './Tags.component';

const Sidebar = (props: any) => {

    // console.log('Sidebar props :', props);

    return (
        <React.Fragment>

            {/* Moved categories list to Header.component.tsx */}
            {/* <Categories {...props} /> */}

            <Tags {...props} />

        </React.Fragment>
    )
}

export default Sidebar;
