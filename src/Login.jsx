import { useState } from "react";

function Login({ setRole }) {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [staffId, setStaffId] = useState("");
  const [department, setDepartment] = useState("Security");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");

  const handleUserLogin = () => {
    const cleanName = userName.trim();
    const cleanRoom = room.trim();

    if (!cleanName || !cleanRoom) {
      setError("User login requires name and room number.");
      return;
    }

    localStorage.setItem("role", "user");
    localStorage.setItem("userName", cleanName);
    localStorage.setItem("room", cleanRoom);
    setRole("user");
  };

  const handleResponderLogin = () => {
    const cleanStaffId = staffId.trim();

    if (!cleanStaffId || !department) {
      setError("Responder login requires Staff ID and department.");
      return;
    }

    localStorage.setItem("role", "responder");
    localStorage.setItem("staffId", cleanStaffId);
    localStorage.setItem("department", department);
    setRole("responder");
  };

  const handleAdminLogin = () => {
    if (adminCode !== "1234") {
      setError("Invalid admin code.");
      return;
    }

    localStorage.setItem("role", "admin");
    setRole("admin");
  };

  return (
    <main className="layout" style={{ gridTemplateColumns: "1fr", maxWidth: 980 }}>
      <section className="card">
        <h1 style={{ marginTop: 0 }}>Crisis Core Login</h1>
        {error ? <p className="error" style={{ marginBottom: 12 }}>{error}</p> : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          <section style={{ border: "1px solid #e4e9f3", borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>USER LOGIN</h3>
            <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              Name
              <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Guest name" />
            </label>
            <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              Room Number
              <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="203" />
            </label>
            <button onClick={handleUserLogin} style={{ padding: "10px 12px" }}>Login as Guest</button>
          </section>

          <section style={{ border: "1px solid #e4e9f3", borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>RESPONDER LOGIN</h3>
            <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              Staff ID
              <input value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="staff_1" />
            </label>
            <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              Department
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="Security">Security</option>
                <option value="Medical">Medical</option>
              </select>
            </label>
            <button onClick={handleResponderLogin} style={{ padding: "10px 12px" }}>Login as Responder</button>
          </section>

          <section style={{ border: "1px solid #e4e9f3", borderRadius: 10, padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>ADMIN LOGIN</h3>
            <label style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              Admin Code
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter code"
              />
            </label>
            <button onClick={handleAdminLogin} style={{ padding: "10px 12px" }}>Login as Admin</button>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Login;
