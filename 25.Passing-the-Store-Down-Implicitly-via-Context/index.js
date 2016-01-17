
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
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render() {
    const {store} = this.context;
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
FilterLink.contextTypes = {
  store: React.PropTypes.object
}

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
// 第一個參數為 property 第二個參數 為 context
const AddTodo = (props, { store }) => {
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
AddTodo.contextTypes = {
  store: React.PropTypes.object
}

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
    const {store} = this.context;
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount () {
    this.unsubscribe();
  }

  render() {
    const {store} = this.context;
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
// 定義 context 型態，如果不定義的話，就不會接收 context
VisibleTodoList.contextTypes = {
  store: React.PropTypes.object
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

class Provider extends Component {
  //  使每個 child 可以得到 Context
  getChildContext() {
    return {
      store: this.props.store
    };
  }

  render() {
    return this.props.children;
  }
}
// 定義 child Context 型態
Provider.childContextTypes = {
  store: React.PropTypes.object
};

// 另一種做法使用 Context 傳 store
// Context 像是各個 component 之間的 global 變數
// 目前還不 stable 有可能 API 會在變
ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
