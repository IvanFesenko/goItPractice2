import {Route, Link} from 'react-router-dom';

import reducer from './redux/reducers';

import Counter from './containers/Counter'
import ReduxCounter from './containers/ReduxCounter'

import {fetchMiddleware} from './redux/middlewares/fetch'

const counterModule = {
    reducers: {Counter: reducer},
    routers: [
        <Route exact path={'/counter'}>
            <Counter />
        </Route>,
        <Route exact path={'/reduxCounter'}>
           <ReduxCounter />
        </Route>
    ],
    navLinks: [
        <div><Link to={'/counter'}>Counter</Link></div>,
        <div><Link to={'/reduxCounter'}>Redux Counter</Link></div>
    ],
    middlewares: [fetchMiddleware]
};

export default counterModule;