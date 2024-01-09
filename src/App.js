import React, { useState, useEffect } from 'react';
import axios from 'axios';


const TodoApp = () => {
  // State to manage todos, newTodo, and editedTodo
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editedTodo, setEditedTodo] = useState({ id: null, title: '' });

  // Fetch todos from the API on initial render
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  // Log updated todos whenever the todos state changes
  useEffect(() => {
    console.log('Updated Todos:', todos);
  }, [todos]);

  // Function to handle adding a new todo
  const handleAddTodo = () => {
    axios.post('https://jsonplaceholder.typicode.com/todos', {
      userId: 1,
      title: newTodo,
      completed: false
    })
      .then(response => {
        // Use the previous state to update todos
        setTodos(prevTodos => [response.data, ...prevTodos]);
        setNewTodo('');
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  // Function to handle updating the completion status of a todo
  const handleUpdateTodo = (id, completed) => {
    axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      completed: !completed
    })
      .then(response => {
        // Update the todos state with the new completion status
        const updatedTodos = todos.map(todo =>
          todo.id === id ? { ...todo, completed: response.data.completed } : todo
        );
        setTodos(updatedTodos);
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  // Function to handle deleting a todo
  const handleDeleteTodo = id => {
    axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
      .then(() => {
        // Filter out the deleted todo and update the todos state
        const updatedTodos = todos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch(error => console.error('Error deleting todo:', error));
  };

  // Function to handle starting the editing process for a todo
  const handleEdit = todo => {
    setEditedTodo({ id: todo.id, title: todo.title });
  };

  // Function to handle saving the edited todo
  const handleSaveEdit = id => {
    axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      title: editedTodo.title
    })
      .then(response => {
        // Update the todos state with the edited todo
        const updatedTodos = todos.map(todo =>
          todo.id === id ? { ...todo, title: response.data.title } : todo
        );
        setTodos(updatedTodos);
        setEditedTodo({ id: null, title: '' });
      })
      .catch(error => console.error('Error updating todo:', error));
  };

  return (
    <>
      <div className="header">
        <h1>Todo App</h1>
        <div className='input'>
          {/* Input for adding new todos */}
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="New Todo"
          />
          {/* Button to trigger adding new todo */}
          <button id='add-todo' onClick={handleAddTodo}>Add Todo</button>
        </div>
      </div>
      <div className="todo-app">
        {/* List to display todos */}
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              {editedTodo.id === todo.id ? (
                // Input and button for editing a todo
                <>
                  <input
                    type="text"
                    value={editedTodo.title}
                    onChange={e => setEditedTodo({ ...editedTodo, title: e.target.value })}
                  />
                  <button id="btn" onClick={() => handleSaveEdit(todo.id)}>Save</button>
                </>
              ) : (
                // Display todo information and buttons for completion, deletion, and editing
                <>
                  {todo.title}
                  <button className={todo.completed ? 'completed' : 'not-completed'} onClick={() => handleUpdateTodo(todo.id, todo.completed)}>
                    {todo.completed ? 'Done' : 'Not Done'}
                  </button>
                  <button id="btn" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                  <button id="btn" onClick={() => handleEdit(todo)}>Edit</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default TodoApp;
