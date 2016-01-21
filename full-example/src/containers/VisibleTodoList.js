
import {connect} from 'react-redux';

import TodoList from '../components/TodoList';
import {toggleTodo} from '../actions/todo';

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
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};

// 定義 VisibleTodoList dispatch 對應到 TodoList 的 props
const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  };
};

// 使用 react-redux connect 產生 Container component
export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
