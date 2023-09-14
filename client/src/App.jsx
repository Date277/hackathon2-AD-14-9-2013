import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import TodoList from "./components/TodoList";
import TodoUser from "./components/TodoUser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<TodoList />} />
      <Route path="/todo" element={<TodoUser />} />
    </Routes>
  );
}

export default App;
