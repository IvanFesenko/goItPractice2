export const actionTypes = {
    INCREMENT: 'INCREMENT',
    DECREMENT: 'DECREMENT'
}

const initialState = {
    counter: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case (actionTypes.INCREMENT): {
            const storage = window.localStorage;
            const newCounter = {counter: state.counter + 1};
            storage.setItem('counter', JSON.stringify(newCounter));
            return {...state, counter: state.counter + 1}
        }

        case (actionTypes.DECREMENT):
            return {...state, counter: state.counter - 1}

        default:
            return state;
    }
};

export default reducer;