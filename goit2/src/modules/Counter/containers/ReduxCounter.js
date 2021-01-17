import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";

import setCounter from '../redux/actions/setCounter'

import CounterView from '../componets/CounterView';

const ReduxCounter = () => {
    const componentName = 'Redux Counter';
    const counter = useSelector(state => state.Counter.counter);
    const dispatch = useDispatch();

    const handleSetCounter = useCallback(key => {
        dispatch(setCounter[key] && setCounter[key]());
    }, [dispatch]);

    return <CounterView title={componentName} counter={counter} setCounter={handleSetCounter}/>
};

export default ReduxCounter;