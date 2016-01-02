
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

const visibilityFilter = (state = 'SHOW_ALL', action) => {
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

//  Filter 的選項
const FilterLink = ({ filter, currentFilter, children }) => {
  //  選擇的 Filter
  if (filter === currentFilter) {
    return (
      <span>{children}</span>
    )
  }
  return (
    <a href="#"
       onClick={e => {
         e.preventDefault();
         store.dispatch({
           type: 'SET_VISIBILITY_FILTER',
           filter
         });
       }}
    >
      {children}
    </a>
  );
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

let nextTodoId = 0;  // 紀錄目前有幾個 todo 當做 todo 的 id
class TodoApp extends Component {
  render() {
    const { todos, visibilityFilter } = this.props;

    // 經由 filter 篩選要顯示的 todo
    const visibleTodos = getVisibleTodos(todos, visibilityFilter);

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
          {visibleTodos.map(todo => {  // todo 列表
            return (
              <li key={todo.id}
                  onClick={() => {  // 點擊 todo 可以 uncompleted/completed todo
                    store.dispatch({
                      type: 'TOGGLE_TODO',
                      id: todo.id
                    });
                  }}
                  style={{  // completed 時, 把 todo 畫上刪節符號
                    textDecoration: todo.completed ? 'line-through' : 'none'
                  }}>
                {todo.text}
              </li>
            );
          })}
        </ul>
        <p>
          Show:
          {' '}
          <FilterLink
            filter='SHOW_ALL'
            currentFilter={visibilityFilter}
          >
            All
          </FilterLink>
          {', '}
          <FilterLink
            filter='SHOW_ACTIVE'
            currentFilter={visibilityFilter}
          >
            Active
          </FilterLink>
          {', '}
          <FilterLink
            filter='SHOW_COMPLETED'
            currentFilter={visibilityFilter}
          >
            completed
          </FilterLink>
        </p>
      </div>
    );
  };
};

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()}/>,
    document.getElementById('root')
  );
};

store.subscribe(render);
render();
