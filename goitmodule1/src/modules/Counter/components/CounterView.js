import React from "react";

const CounterView = ({title, count, setCount}) => {
    return <div>
        <div>{title}</div>
        <div onClick={() => setCount('increment')}> +</div>
        <div>{count}</div>
        <div onClick={() => setCount('decrement')}> -</div>
    </div>
};

export default CounterView;