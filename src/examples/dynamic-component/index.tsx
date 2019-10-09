import { lazy } from 'react';

const GraphView = lazy(() => import(`./GraphView`));
const NullView = lazy(() => import(`./NullView`));
const TableView = lazy(() => import(`./TableView`));

export { GraphView, NullView, TableView };
