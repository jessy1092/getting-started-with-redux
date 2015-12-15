z
var expect = require('expect');

function counter(state, action) {
  if (typeof state === 'undefined') {
    return 0;
  }

  if (action.type === 'INCREMENT') {
    return state + 1;
  } else if (action.type === 'DECREMENT') {
    return state - 1;
  } else {
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
