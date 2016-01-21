
import React from 'react';

const AddTodoEntry = ({onClick}) => {
  let input;

  return (
    <div>
      <input ref={node => {
          input = node;
        }}/>
      <button onClick={() => {
        onClick(input.value);
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};

export default AddTodoEntry;
