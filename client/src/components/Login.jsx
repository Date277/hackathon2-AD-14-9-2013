import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/v1/user", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, role } = response.data;

        // Lưu token vào localStorage để sử dụng sau này
        localStorage.setItem("token", token);

        // Kiểm tra vai trò và chuyển hướng dựa trên vai trò
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "user") {
          navigate("/todo");
        } else {
          alert("tài khoản mật khẩu không đúng ");
        }
      } else {
        alert("Đăng nhập không thành công.");
      }
    } catch (error) {
      alert("tài khoản hoặc mật khẩu không đúng", error);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
