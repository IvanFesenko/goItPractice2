import React from "react";
import {Route, Link} from 'react-router-dom';

import Counter from './containers/Counter'
import ReduxCounter from './containers/ReduxCounter'

import reducer from './redux/reducers';

const counterModule = {
    reducers: {Counter: reducer},
    routes: [
        <Route exact path={'/counter'}>
            <Counter />
        </Route>,
        <Route exact path={'/reduxCounter'} component={ReduxCounter}/>,
    ],
    navItems: [
        <Link to={'counter'}>counter</Link>,
        <Link to={'reduxCounter'}>redux counter</Link>,
    ]
}


export default counterModule;