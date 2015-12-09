
import expect from 'expect';
import deepFreeze from 'deep-freeze';

// Not pure function
// const addCounter = (list) => {
//   list.push(0);
//   return list;
// };

const addCounter = (list) => {
  // ES5
  // return list.concat([0]);
  // ES6
  return [...list, 0]
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  deepFreeze(listBefore);

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

// Not pure function
// const removeCounter = (list, index) => {
//   list.splice(index, 1);
//   return list;
// };

const removeCounter = (list, index) => {
  // ES5
  // return list
  //   .slice(0, index)
  //   .concat(list.slice(index + 1));
  // ES6
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];

  deepFreeze(listBefore);

  expect(
    removeCounter(listBefore, 1)
  ).toEqual(listAfter);
};

// Not pure function
// const incrementCounter = (list, index) => {
//   list[index]++;
//   return  list;
// };

const incrementCounter = (list, index) => {
  // ES5
  // return list
  //   .slice(0, index)
  //   .concat([list[index] + 1])
  //   .concat(list.slice(index + 1));
  // ES6
  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index + 1)
  ];
};

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];

  deepFreeze(listBefore);

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log('All tests passed!');
