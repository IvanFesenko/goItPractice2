import React, {useState} from "react";

import CounterView from '../componets/CounterView'

const Counter = () => {
    const componentName = 'Counter';
    const [counter, setCounter] = useState(0);

    const handleSetCounter = (key) => {
        return setCounter(pS => key === 'increment' ? pS + 1: pS - 1);
    }

    return <CounterView title={componentName} counter={counter} setCounter={handleSetCounter} />
};

export default Counter;