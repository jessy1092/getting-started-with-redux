
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

// Presentational Component
const Link = ({ active, children, onClick }) => {
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

// Container Component
class FilterLink extends Component {
  componentDidMount() {
    // store subscribe 會回傳 unsubscribe function
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()  // store 更新時, 提醒 Container Component 重新 render
    );
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render() {
    const {filter, children} = this.props;
    const {visibilityFilter} = store.getState();

    return (
      <Link
        active={filter === visibilityFilter}
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter
          })
        }
      >
        {children}
      </Link>
    );
  }
}

// Presentational Component
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
const Todo = ({ onClick, completed, text }) => (
  <li
    onClick={onClick}
    style={{ textDecoration: completed ? 'line-through' : 'none' }}>
    {text}
  </li>
);

// Presentational Component
const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => {
          // 使用 callback function, 監聽 onClick 事件, 觸發時, 呼叫 onTodoClick 並傳入 todo's id
          onTodoClick(todo.id);
        }}
      />
    )}
  </ul>
);

let nextTodoId = 0;
// Container Component
const AddTodo = () => {
  let input;

  return (
    <div>
      <input ref={node => {
          input = node;
        }}/>
      <button onClick={() => {
        store.dispatch({
          type: 'ADD_TODO',
          id: nextTodoId++,
          text: input.value
        });
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};

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

// Container component
class VisibleTodoList extends Component {
  componentDidMount() {
    // store subscribe 會回傳 unsubscribe function
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()  // store 更新時, 提醒 Container Component 重新 render
    );
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render() {
    const {todos, visibilityFilter} = store.getState();

    return (
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })
        }
      />
    );
  }
}

// Presentational component
// 負責 render 各個 Container component
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);
