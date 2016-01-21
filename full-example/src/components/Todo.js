
import React from 'react';

// Presentational Component
const Todo = ({onClick, completed, text}) => (
  <li
    onClick={onClick}
    style={{ textDecoration: completed ? 'line-through' : 'none' }}>
    {text}
  </li>
);

export default Todo;
