z
const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

// In React 0.14, React Component can be the function
const Counter = ({
  value,        // Component properties
  onIncrement,  // For button(+) onClick 事件
  onDecrement   // For button(-) onClick 事件
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

const { createStore } = Redux;
const store = createStore(counter);

const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => (
        // Callback function, 註冊在 button(+) onClick 事件
        // 當被按下 + 按鈕時， dispatch INCREMENT action 給 store
        // action 經過 reducer(counter) 處理， current state + 1
        // 通知註冊的 listener(render)，使得 ReactDOM 重新 render
        store.dispatch({
          type: 'INCREMENT'
        })
      )}
      onDecrement={() => (
        // Callback function, 註冊在 button(-) onClick 事件
        store.dispatch({
          type: 'DECREMENT'
        })
      )}
    />,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
