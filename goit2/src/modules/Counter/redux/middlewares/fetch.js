import {act} from "@testing-library/react";

export const fetchMiddleware = ({getState, dispatch}) =>
    next => action => {
        if (action.asyncActions) {
            (async () => {
                try {
                    const response = await action.asyncActions();
                    console.log("-> response", response);
                    next({type: 'DECREMENT_SUCCESS'});
                } catch (e) {
                    console.log("-> e", e);
                    next({type: 'DECREMENT_FAIL'});
                }
            })()
        }
    };



