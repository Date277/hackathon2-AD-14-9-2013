const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const PORT = 3000;
const jwtSecret = "123456";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const pool = mysql.createPool({
  database: "todo_app",
  user: "root",
  password: "haianh123",
  host: "localhost",
  port: "3306",
});

// Đăng nhập và tạo token
app.post("/api/v1/user", (req, res) => {
  const { username, password } = req.body;

  // Truy vấn cơ sở dữ liệu để kiểm tra tài khoản
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  pool.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn cơ sở dữ liệu:", err);
      return res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu." });
    }

    // Kiểm tra nếu có kết quả từ cơ sở dữ liệu
    if (results.length > 0) {
      const user = results[0];

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        jwtSecret,
        {
          expiresIn: "1h",
        }
      );

      res.json({ token, role: user.role });
    } else {
      res.status(401).json({ message: "Đăng nhập không thành công." });
    }
  });
});

// Lấy danh sách công việc
app.get("/api/v1/task", (req, res) => {
  const query = "SELECT * FROM tasks";
  pool.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

// Thêm công việc mới
app.post("/api/v1/task", (req, res) => {
  const { title, description } = req.body;

  const query = "INSERT INTO tasks (title, description) VALUES (?, ?)";
  pool.query(query, [title, description], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const newTask = { id: results.insertId, title, description };
      res.status(201).json(newTask);
    }
  });
});

// Cập nhật công việc
app.put("/api/v1/task/:id", (req, res) => {
  const { title, description } = req.body;
  const taskId = req.params.id;

  const query = "UPDATE tasks SET title = ?, description = ? WHERE id = ?";
  pool.query(query, [title, description, taskId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ id: taskId, title, description });
    }
  });
});

// Xóa công việc
app.delete("/api/v1/task/:id", (req, res) => {
  const taskId = req.params.id;

  const query = "DELETE FROM tasks WHERE id = ?";
  pool.query(query, [taskId], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(204).send();
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening on: http://localhost:${PORT}`);
});
