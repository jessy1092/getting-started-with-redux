
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

const createStore = (reducer) => {
  let state;  // 目前的 state
  let listeners = [];  // 所有註冊的 listener

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);  // dispatch 時，傳送目前的 state 進去 reducer
    listeners.forEach(listener => listener());  // 通知所有註冊的 listener
  };

  const subscribe = (listener) => {
    listeners.push(listener);  // 註冊 listener 存入 listeners 陣列

    return () => {  // 回傳 function ，作為移除 listener 使用。
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});  // 初始化 state

  return { getState, dispatch, subscribe };
}

const store = createStore(counter);

const render = () => {
  document.body.innerHTML = store.getState();
};

store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});
