import { useEffect, useState } from "react";
import "./App.css";
import SOS from "./SOS";
import Dashboard from "./Dashboard";
import Login from "./Login";

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("room");
    localStorage.removeItem("staffId");
    localStorage.removeItem("department");
    setRole(null);
  };

  if (!role) {
    return <Login setRole={setRole} />;
  }

  const userName = localStorage.getItem("userName") || "Guest";
  const room = localStorage.getItem("room") || "-";
  const staffId = localStorage.getItem("staffId") || "-";
  const department = localStorage.getItem("department") || "-";

  return (
    <main className="layout" style={{ gridTemplateColumns: "1fr", maxWidth: 980 }}>
      <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div>
            <h1 style={{ marginTop: 0, marginBottom: 6 }}>Crisis Core</h1>
            <p className="subtitle" style={{ marginBottom: 0 }}>Logged in as: {role}</p>
          </div>
          <button onClick={handleLogout} style={{ padding: "8px 12px" }}>Logout</button>
        </div>

        <div style={{ marginTop: 16 }}>
          {role === "user" ? (
            <section style={{ marginBottom: 12 }}>
              <p style={{ margin: "0 0 4px" }}><strong>Welcome:</strong> {userName}</p>
              <p style={{ margin: 0 }}><strong>Room:</strong> {room}</p>
            </section>
          ) : null}

          {role === "responder" ? (
            <section style={{ marginBottom: 12 }}>
              <p style={{ margin: "0 0 4px" }}><strong>Staff ID:</strong> {staffId}</p>
              <p style={{ margin: 0 }}><strong>Department:</strong> {department}</p>
            </section>
          ) : null}

          {role === "admin" ? (
            <section style={{ marginBottom: 12 }}>
              <p style={{ margin: 0, fontWeight: 700 }}>Control Room Dashboard</p>
            </section>
          ) : null}

          {role === "user" ? <SOS role={role} /> : null}
          {role === "responder" || role === "admin" ? <Dashboard role={role} /> : null}
        </div>
      </section>
    </main>
  );
}

export default App;
