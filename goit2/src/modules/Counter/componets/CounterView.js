import React from "react";

const CounterView = ({title, counter, setCounter}) => {
    return <div>
        <div>{title}</div>
        <div onClick={() => setCounter('increment')}> +</div>
        <div>{counter}</div>
        <div onClick={() => setCounter('decrement')}> -</div>
    </div>
};

export default CounterView;