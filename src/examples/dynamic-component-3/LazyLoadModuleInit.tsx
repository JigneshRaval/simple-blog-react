// https://codeburst.io/dynamic-imports-react-and-redux-29f6d2d88d77

import React from 'react';
import { LazyLoadModule } from './LazyLoadModule';

function LazyLoadModuleInit() {
    return (
        <div className="App">
            <h1>First Module</h1>
            <LazyLoadModule resolve={() => import('./modules/basic')} />
            <LazyLoadModule resolve={() => import('./modules/nested')} />
        </div>
    );
}

export default LazyLoadModuleInit;
