
import {connect} from 'react-redux';

import AddTodoEntry from '../components/AddTodoEntry';
import {addTodo} from '../actions/todo';

const mapDispatchToProps = (dispatch) => {
  return {
    onClick: (text) => {
      dispatch(addTodo(text));
    }
  }
}

// state 不必要, dispatch 使用預設的 dispatch, 所以都可以省略為 null
export default connect(null, mapDispatchToProps)(AddTodoEntry);
