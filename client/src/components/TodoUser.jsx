import axios from "axios";
import React, { useEffect, useState } from "react";

function TodoUser() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/task");
        setTodos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="container">
      <h1>Những công việc cần làm</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên công việc</th>
            <th scope="col">Miêu tả công việc</th>
          </tr>
        </thead>
        {todos.map((todo) => (
          <tbody key={todo.id}>
            <tr>
              <th scope="row">{todo.id}</th>
              <td>{todo.title}</td>
              <td>{todo.description}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default TodoUser;
