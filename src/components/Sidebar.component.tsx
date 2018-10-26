// Sidebar.component.tsx

// Sidebar component : which displays list of Categories and Tags

import React, { Component } from 'react';

import Categories from './Categories.component';
import Tags from './Tags.component';

const Sidebar = (props: any) => {

    /* const openform = () => {
        UIkit.modal('#modal-example').show();
    } */

    console.log('Sidebar props :', props);
    return (
        <React.Fragment>
            {/*
            <button className="uk-button uk-button-secondary" uk-toggle="target: #modal-example" onClick={openform}>Add Article</button>
            */}
            <Categories {...props}  />
            <Tags {...props} />
        </React.Fragment>
    )
}

export default Sidebar;
