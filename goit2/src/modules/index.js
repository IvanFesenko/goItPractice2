import React from 'react';

import counterModule from './Counter';
import coreModule from './Core';

class Base {
    constructor(...modules) {
        this._reducers = modules.reduce((acc, {reducers}) => {
            return reducers ? {...acc, ...reducers} : {...acc};
        }, {});

        this._middlewares = modules.reduce((acc, {middlewares}) => {
            return middlewares ? [...acc, ...middlewares] : [...acc];
        }, []);

        this._routers = modules.reduce((acc, {routers}) => {
            return routers ? [...acc, ...routers] : [...acc];
        }, []);

        this._navLinks = modules.reduce((acc, {navLinks}) => {
            return navLinks ? [...acc, ...navLinks] : [...acc];
        }, []);

    };

    getReducers = () => {
        return this._reducers;
    }

    getMiddlewares = () => {
        return this._middlewares;
    };

    getRouters = () => {
        return this._routers?.map((component, idx) => React.cloneElement(
            component,
            {key: `${idx}/${this._routers.length}`}));
    };

    getNavLinks = () => {
        return this._navLinks?.map((component, idx) => React.cloneElement(
            component,
            {key: `${idx}/${this._navLinks.length}`}));
    };
};

const baseModule = new Base(coreModule, counterModule);

export default baseModule;