
import ReactDOM from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux';

import TodoApp from './components/TodoApp';
import configureStore from './store/configureStore';

// 使用 react-redux 提供的 Provider
ReactDOM.render(
  <Provider store={configureStore()}>
    <TodoApp />
  </Provider>,
  document.getElementById('root')
);
