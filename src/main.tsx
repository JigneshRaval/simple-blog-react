// ./src/main.tsx

// REACT
// ==========================
import React from "react";
import * as ReactDOM from "react-dom";


// CSS
// ==========================
import './assets/styles/main.scss';


// VENDOR
// ==========================
import './vendor.ts';


// APP COMPONENT
// ==========================
import App from './App';

/*
import HOC from './components/HOC-examples/HOC.component';
import UserName from './components/HOC-examples/username.component';

const HOCDemo = HOC(UserName);
*/

// RENDER APP
// ==========================
ReactDOM.render(
    <App />,
    document.getElementById("app")
);
