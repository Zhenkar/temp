import React, { useState, useEffect } from "react";
import axios from "axios";

function Marks() {
  const [marks, setMarks] = useState([]);
  const [form, setForm] = useState({ student_id: "", subject: "", score: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/marks", form)
      .then(() => {
        fetchMarks(form.student_id);
        setForm({ student_id: "", subject: "", score: "" });
      });
  };

  const fetchMarks = (id) => {
    axios.get(`http://localhost:5000/marks/${id}`)
      .then(res => setMarks(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Marks</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Student ID" value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })} required />
        <input placeholder="Subject" value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        <input type="number" placeholder="Score" value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })} required />
        <button type="submit">Add Marks</button>
      </form>

      <br />
      <button onClick={() => fetchMarks(form.student_id)}>Fetch Marks</button>

      <h3>Records</h3>
      <ul>
        {marks.map(m => (
          <li key={m.id}>{m.subject}: {m.score}</li>
        ))}
      </ul>
    </div>
  );
}

export default Marks;

