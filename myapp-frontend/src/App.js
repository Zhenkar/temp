import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Marks from "./pages/Marks";
import Placements from "./pages/Placements";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <h1>University App 🎓</h1>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Students</Link> |{" "}
          <Link to="/attendance">Attendance</Link> |{" "}
          <Link to="/marks">Marks</Link> |{" "}
          <Link to="/placements">Placements</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/marks" element={<Marks />} />
          <Route path="/placements" element={<Placements />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

