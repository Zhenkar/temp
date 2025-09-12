require("dotenv").config();  // <-- add this first line

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL connection using env vars
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error("❌ DB connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL");

  // Auto-create tables
  const tables = [
    `CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      roll_no VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      date DATE,
      status ENUM('Present','Absent'),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS marks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      subject VARCHAR(100),
      score INT,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS placements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT,
      company VARCHAR(100),
      status ENUM('Placed','Not Placed'),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )`
  ];

  tables.forEach(q => db.query(q, err => err && console.error(err)));
  console.log("✅ Tables ready");
});


// ---------------------- APIs ----------------------

// 🔹 Students
app.post("/students", (req, res) => {
  const { name, roll_no, email } = req.body;
  db.query("INSERT INTO students (name, roll_no, email) VALUES (?, ?, ?)",
    [name, roll_no, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Student added", id: result.insertId });
    });
});

app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.get("/students/search/:roll_no", (req, res) => {
  db.query("SELECT * FROM students WHERE roll_no = ?", [req.params.roll_no], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🔹 Attendance
app.post("/attendance", (req, res) => {
  const { student_id, date, status } = req.body;
  db.query("INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)",
    [student_id, date, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Attendance marked" });
    });
});

app.get("/attendance/:student_id", (req, res) => {
  db.query("SELECT * FROM attendance WHERE student_id = ?", [req.params.student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🔹 Marks
app.post("/marks", (req, res) => {
  const { student_id, subject, score } = req.body;
  db.query("INSERT INTO marks (student_id, subject, score) VALUES (?, ?, ?)",
    [student_id, subject, score],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Marks added" });
    });
});

app.get("/marks/:student_id", (req, res) => {
  db.query("SELECT * FROM marks WHERE student_id = ?", [req.params.student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// 🔹 Placements
app.post("/placements", (req, res) => {
  const { student_id, company, status } = req.body;
  db.query("INSERT INTO placements (student_id, company, status) VALUES (?, ?, ?)",
    [student_id, company, status],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Placement updated" });
    });
});

app.get("/placements/:student_id", (req, res) => {
  db.query("SELECT * FROM placements WHERE student_id = ?", [req.params.student_id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// -------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));

