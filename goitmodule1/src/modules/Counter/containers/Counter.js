import React, {useState} from "react";

import CounterView from "../components/CounterView";

const Counter = () => {
    const [count, setCount] = useState(0);

    const handleSetCount = (key) => {
        setCount(pS => key === 'increment' ? pS + 1 : pS - 1);
    }

    return <CounterView title={'counter'} count={count} setCount={handleSetCount}/>
};

export default Counter;