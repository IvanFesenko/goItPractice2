import React from 'react';
import {Switch, BrowserRouter as Router} from "react-router-dom";
import {createStore, combineReducers, applyMiddleware} from "redux";
import {Provider} from 'react-redux';
import {createBrowserHistory} from "history";

import BaseModule from './modules/index';

import './assets/styles/App.css';

const middlewares = BaseModule.getMiddlewares();
const reducers = BaseModule.getReducers();
const routes = BaseModule.getRoutes();
const navItems = BaseModule.getNavItems();

const store = createStore(combineReducers({...reducers}), applyMiddleware(...middlewares || []));


const history = createBrowserHistory();

function App() {
    return (
        <Provider store={store}>
            <Router history={history}>
                <>
                    <div>
                        {navItems}
                    </div>
                    <Switch>{routes}</Switch>
                </>
            </Router>
        </Provider>
    );
}

export default App;
