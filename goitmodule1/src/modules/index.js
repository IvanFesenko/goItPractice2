import React from 'react';

import Counter from './Counter';

class Base {
    constructor(...modules) {
        this._middlewares = modules.reduce((acc, {middlewares}) => {
            return middlewares ? [...acc, ...middlewares] : [...acc];
        }, []);

        this._routes = modules.reduce((acc, {routes}) => {
            return routes ? [...acc, ...routes] : [...acc];
        }, []);

        this._navItems = modules.reduce((acc, {navItems}) => {
            return navItems ? [...acc, ...navItems] : [...acc];
        }, []);


        this._reducers = modules.reduce((acc, {reducers}) => {
            return reducers ? {...acc, ...reducers} : {...acc};
        }, {});
    };

    getReducers() {
        return this._reducers
    }

    getRoutes() {
        return this._routes?.map((component, idx) => React.cloneElement(
            component,
            {key: `${idx}${this._routes.length}`}));
    }

    getMiddlewares() {
        return this._middlewares
    }

    getNavItems() {
        return this._navItems?.map((component, idx) => React.cloneElement(
            <div>{component}</div>,
            {key: `${idx}${this._navItems.length}`}));
    }
}

const baseModule = new Base(Counter);

export default baseModule;