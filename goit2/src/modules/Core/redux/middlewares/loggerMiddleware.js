export const loggerMiddleware = ({getState, dispatch}) => {
    console.log("-> state", getState);
    return next => action => {
        if (action) {
            console.info('action.type ====>>', action.type);
            console.info('action.payload ====>>', action.payload);
        }

        next(action);
    };
}






