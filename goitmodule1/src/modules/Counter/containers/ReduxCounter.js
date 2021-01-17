import React, {useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";

import CounterView from "../components/CounterView";

import {increment, decrement} from '../redux/actions/mutateCounter'

const ReduxCounter = () => {
    const count = useSelector(state => state.Counter.counter);
    const dispatch = useDispatch();

    const handleSetCounter = useCallback(key =>
        dispatch(key === 'increment' ? increment() : decrement()),
        []
    );

    return <CounterView title={'redux counter'} count={count} setCount={handleSetCounter}/>
};

export default ReduxCounter;