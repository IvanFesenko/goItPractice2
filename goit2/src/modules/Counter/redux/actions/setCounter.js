import {actionTypes} from '../reducers';

export const increment = () => {
    return {
        type: actionTypes.INCREMENT
    }
};

export const decrement = () => {
    return {
        type: actionTypes.DECREMENT,
        asyncActions: async () =>  fetch('http://test.com/1221ddsdsd')
    }
};
export const extraAction = () => {
    return {
        type: 'EXTRA'
    }
};

const setCounter = {increment, decrement, extraAction};

export default setCounter;