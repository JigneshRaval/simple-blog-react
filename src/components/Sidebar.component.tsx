// Sidebar.component.tsx

// Sidebar component : which displays list of Categories and Tags

import React, { Component } from 'react';

import Categories from './Categories.component';
import Tags from './Tags.component';

const Sidebar = (props: any) => {

    console.log('Sidebar props :', props);
    return (
        <React.Fragment>
            <header>
                <h5>WEB-GEMS</h5>
            </header>
            <button className="uk-button uk-button-secondary" onClick={() => props.onShowAddEditForm(true)}>Add Article</button>
            <Categories {...props}  />
            <Tags {...props} />

        </React.Fragment>
    )
}

export default Sidebar;
