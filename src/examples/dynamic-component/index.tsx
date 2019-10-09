import { lazy } from 'react';

const GraphView = lazy(() => import(`./GraphView.component`));
const NullView = lazy(() => import(`./NullView.component`));
const TableView = lazy(() => import(`./TableView.component`));

export { GraphView, NullView, TableView };
