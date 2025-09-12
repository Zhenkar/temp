import React, { useState, useEffect } from "react";
import axios from "axios";

function Placements() {
  const [placements, setPlacements] = useState([]);
  const [form, setForm] = useState({ student_id: "", company: "", status: "Placed" });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/placements", form)
      .then(() => {
        fetchPlacements(form.student_id);
        setForm({ student_id: "", company: "", status: "Placed" });
      });
  };

  const fetchPlacements = (id) => {
    axios.get(`http://localhost:5000/placements/${id}`)
      .then(res => setPlacements(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Placements</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Student ID" value={form.student_id}
          onChange={(e) => setForm({ ...form, student_id: e.target.value })} required />
        <input placeholder="Company" value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })} required />
        <select value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option>Placed</option>
          <option>Not Placed</option>
        </select>
        <button type="submit">Add Placement</button>
      </form>

      <br />
      <button onClick={() => fetchPlacements(form.student_id)}>Fetch Placements</button>

      <h3>Records</h3>
      <ul>
        {placements.map(p => (
          <li key={p.id}>{p.company}: {p.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Placements;

