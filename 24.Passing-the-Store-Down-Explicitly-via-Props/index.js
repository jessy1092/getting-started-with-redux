
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
    const {store} = this.props;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render() {
    const {store} = this.props;
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
const Footer = ({ store }) => (
  <p>
    Show:
    {' '}
    <FilterLink filter='SHOW_ALL' store={store}>All</FilterLink>
    {', '}
    <FilterLink filter='SHOW_ACTIVE' store={store}>Active</FilterLink>
    {', '}
    <FilterLink filter='SHOW_COMPLETED' store={store}>completed</FilterLink>
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
          onTodoClick(todo.id);
        }}
      />
    )}
  </ul>
);

let nextTodoId = 0;
// Container Component
const AddTodo = ({ store }) => {
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
    const {store} = this.props;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render() {
    const {store} = this.props;
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
const TodoApp = ({ store }) => (
  <div>
    <AddTodo store={store}/>
    <VisibleTodoList store={store}/>
    <Footer store={store}/>
  </div>
);

// 23 章以前 store 為 singleton, 只有單一的 store
// 這會造成 2 點問題
// 1. 不好 debug, 在 testing 裡，會希望做很多種 store 來測試 component
// 2. 很難製作 universal application, 因為 server side render
//    往往每個 connection 都有不同的 store
// const store = createStore(todoApp);
// 因此我們需要傳入 store 從上到下給每個 component
ReactDOM.render(
  <TodoApp store={createStore(todoApp)} />,
  document.getElementById('root')
);
