
import expect from 'expect';
import deepFreeze from 'deep-freeze';

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,  // concat old state
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    default:
      return state;  // 其他 action 都回傳 current state
  }
}

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];

  // 確保 todos reducer 是 pure function
  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
}

testAddTodo();
console.log('All tests passed!');
