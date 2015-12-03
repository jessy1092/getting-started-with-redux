
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

const { createStore } = Redux;
// var createStore = Redux.createStore;  // ES5
// import { createStore } from 'redux';  // ES6

const store = createStore(counter);
// console.log(store.getState());  // 0 因為初始值為 0

// store.dispatch({ type: 'INCREMENT' });  // dispatch action: INCREMENT
// console.log(store.getState());  // 1

const render = () => {
  document.body.innerHTML = store.getState();  // state 輸出在 body 裡
};

store.subscribe(render);  // 註冊事件，當 action 經過 reducer 處理完後觸發事件。
render();  // 第一次 render

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });  // 當點擊時，dispatch action: INCREMENT
});
