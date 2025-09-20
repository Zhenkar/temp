import React, { useState, useEffect } from "react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", roll_no: "", email: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get("/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/students", form)
      .then(() => {
        fetchStudents();
        setForm({ name: "", roll_no: "", email: "" });
      });
  };

  const handleSearch = () => {
    axios.get(`/api/students/search/${search}`)
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Student Info</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Roll No" value={form.roll_no}
          onChange={(e) => setForm({ ...form, roll_no: e.target.value })} required />
        <input placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <button type="submit">Add Student</button>
      </form>

      <br />

      <input placeholder="Search Roll No"
        value={search} onChange={(e) => setSearch(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      <h3>Students List</h3>
      <ul>
        {students.map(s => (
          <li key={s.id}>{s.name} ({s.roll_no}) - {s.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default Students;

