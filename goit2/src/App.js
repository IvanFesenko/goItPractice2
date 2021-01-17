import React from "react";
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Switch} from 'react-router-dom';

import './assets/styles/App.css';

import baseModule from './modules';

const middlewares = baseModule.getMiddlewares();
const routers = baseModule.getRouters();
const reducers = baseModule.getReducers();
const navLinks = baseModule.getNavLinks();


const store = createStore(
    combineReducers({...reducers}),
    applyMiddleware(...middlewares)
);

function App() {
    return (
        <Provider store={store}>
            <Router>
                <div>
                    {navLinks}
                </div>
                <Switch>
                    {routers}
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
