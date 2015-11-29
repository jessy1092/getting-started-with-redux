
import expect from 'expect';

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

expect(
  counter(0, {type: 'INCREMENT'})
).toEqual(1);

expect(
  counter(1, {type: 'INCREMENT'})
).toEqual(2);

expect(
  counter(2, {type: 'DECREMENT'})
).toEqual(1);

expect(
  counter(1, {type: 'DECREMENT'})
).toEqual(0);

// 沒有定義的 action 回傳值不變
expect(
  counter(1, {type: 'SONETHING_ELSE'})
).toEqual(1);

// 初始值
expect(
  counter(undefined, {})
).toEqual(0);

console.log('Tests passed!');
