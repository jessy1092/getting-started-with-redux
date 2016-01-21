
import {connect} from 'react-redux';

import Link from '../components/Link';
import {setVisibilityFilter} from '../actions/visibilityFilter';

// 第二個參數為 FilterLink 自己的 props
const mapStateToProps = (state, ownProps) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  };
};

// 使用 react-redux connect 產生 Container component
export default connect(mapStateToProps, mapDispatchToProps)(Link);
