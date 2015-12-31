
import {createStore, combineReducers} from 'redux';
import ReactDOM from 'react-dom';
import React, { Component } from 'react';

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
        return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

let nextTodoId = 0;  // 紀錄目前有幾個 todo 當做 todo 的 id
class TodoApp extends Component {
  render() {
    return (
      <div>
        <input ref={node => {
            this.input = node;  // 紀錄 input 的節點
          }}/>
        <button onClick={() => {  // 新增 Todo 的 button
          store.dispatch({
            type: 'ADD_TODO',
            text: this.input.value,  // 取得 input 的值
            id: nextTodoId++
          });
          this.input.value = '';  // 清除 input 的值
        }}>
          Add Todo
        </button>
        <ul>
          {this.props.todos.map(todo => {  // todo 列表
            return (
              <li key={todo.id}>
                {todo.text}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
};

const render = () => {
  ReactDOM.render(
    <TodoApp todos={store.getState().todos}/>,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
