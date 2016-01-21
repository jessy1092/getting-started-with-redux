
import {createStore, combineReducers} from 'redux';
import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import {Provider, connect} from 'react-redux';

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

// 抽取出 action
let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};

// Presentational Component
const Link = ({active, children, onClick}) => {
  if (active) {
    return (
      <span>{children}</span>
    );
  }
  return (
    <a
      href="#"
      onClick={e => {
       e.preventDefault();
       onClick();
      }}
    >
      {children}
    </a>
  );
};

// 第二個參數為 FilterLink 自己的 props
const mapStateToLinkProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
};

const mapDispatchToLinkProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  };
};

// 使用 react-redux connect 產生 Container component
const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

// Presentational Component
// 不在需要傳 store 給 FilterLink, FilterLink 已經經由 context 拿到 store
const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL'>All</FilterLink>
    {', '}
    <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>
    {', '}
    <FilterLink filter='SHOW_COMPLETED'>completed</FilterLink>
  </p>
);


// Presentational Component
const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{ textDecoration: completed ? 'line-through' : 'none' }}>
    {text}
  </li>
);

// Presentational Component
const TodoList = ({todos, onTodoClick}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => {
          onTodoClick(todo.id);
        }}
      />
    )}
  </ul>
);

// 使用 react-redux 的 connect 傳入 dispatch
let AddTodo = ({dispatch}) => {
  let input;

  return (
    <div>
      <input ref={node => {
          input = node;
        }}/>
      <button onClick={() => {
        dispatch(addTodo(input.value));
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};

// AddTodo = connect(
//   state => {
//     return {};
//   },
//   dispatch => {
//     return {dispatch};
//   }
// )(AddTodo);

// state 不必要, dispatch 使用預設的 dispatch, 所以都可以省略為 null
AddTodo = connect()(AddTodo);


const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed);
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed);
  }
};

// 定義 VisibleTodoList state 對應到 TodoList 的 props
const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

// 定義 VisibleTodoList dispatch 對應到 TodoList 的 props
const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  };
};

// 使用 react-redux connect 產生 Container component
const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps,
)(TodoList);

// Presentational component
// 負責 render 各個 Container component
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

// 使用 react-redux 提供的 Provider
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
