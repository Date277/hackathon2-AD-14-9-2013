import axios from "axios";
import React, { useEffect, useState } from "react";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);

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

  const handleAdd = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/task", {
        title: newTitle,
        description: newDescription,
      });
      setTodos([...todos, response.data]);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (todo) => {
    setUpdateTitle(todo.title);
    setUpdateDescription(todo.description);
    setSelectedTodo(todo);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/task/${selectedTodo.id}`,
        {
          title: updateTitle,
          description: updateDescription,
        }
      );
      const updatedTodo = response.data;
      const updatedTodos = todos.map((t) =>
        t.id === updatedTodo.id ? updatedTodo : t
      );
      setTodos(updatedTodos);
      setSelectedTodo(null);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (todo) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/task/${todo.id}`);
      const updatedTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container ">
      <h1>Admin Todo</h1>
      <form className="add-work">
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Tên công việc"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Miêu tả công việc"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
        </div>
        <button
          style={{ marginTop: "10px" }}
          type="button"
          className="btn btn-success"
          onClick={handleAdd}
        >
          Add new work
        </button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Tên công việc</th>
            <th scope="col">Miêu tả công việc</th>
            <th scope="col" colSpan={2}>
              Action
            </th>
          </tr>
        </thead>
        {todos.map((todo) => (
          <tbody key={todo.id}>
            <tr>
              <th scope="row">{todo.id}</th>
              <td>{todo.title}</td>
              <td>{todo.description}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() => handleEdit(todo)} // Gọi hàm handleEdit để hiển thị dữ liệu trong modal
                >
                  Update
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(todo)}
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
      {/* modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setSelectedTodo(null)} // Đóng modal
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên công việc"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Miêu tả công việc"
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setSelectedTodo(null)} // Đóng modal
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
