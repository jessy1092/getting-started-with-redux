
import {createStore} from 'redux';
import reducer from '../reducers';

export default () => {
  return createStore(reducer);
}
