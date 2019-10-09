import * as React from 'react';
import { LazyLoadModule } from '../LazyLoadModule';

export default {
    view: () => (
        <div>
            <h1>Nested Module</h1>
            <LazyLoadModule resolve={() => import('./basic')} />
        </div>
    )
};
