import { useState } from "react";

function Login({ setRole }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [staffId, setStaffId] = useState("");
  const [department, setDepartment] = useState("Security");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");

  const goBack = () => {
    setSelectedRole(null);
    setError("");
  };

  const handleUserLogin = () => {
    const cleanName = userName.trim();
    const cleanRoom = room.trim();

    if (!cleanName || !cleanRoom) {
      setError("Please enter name and room number.");
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
      setError("Please enter Staff ID and department.");
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
    <main className="layout" style={{ gridTemplateColumns: "1fr", maxWidth: 520, placeItems: "center" }}>
      <section className="card" style={{ width: "100%", maxWidth: 460, textAlign: "center" }}>
        <h1 style={{ marginTop: 0 }}>Crisis Core Login</h1>

        {selectedRole === null ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <h2 style={{ margin: 0 }}>Who are you?</h2>
            <button onClick={() => setSelectedRole("user")} style={{ padding: "10px 14px" }}>
              Login as User
            </button>
            <button onClick={() => setSelectedRole("responder")} style={{ padding: "10px 14px" }}>
              Login as Responder
            </button>
            <button onClick={() => setSelectedRole("admin")} style={{ padding: "10px 14px" }}>
              Login as Admin
            </button>
          </div>
        ) : null}

        {selectedRole === "user" ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12, textAlign: "left" }}>
            <h2 style={{ margin: 0, textAlign: "center" }}>User Login</h2>
            <label style={{ display: "grid", gap: 6 }}>
              Name
              <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Guest name" />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              Room Number
              <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="203" />
            </label>
            <button onClick={handleUserLogin} style={{ padding: "10px 14px" }}>
              Login as Guest
            </button>
            <button onClick={goBack} style={{ padding: "10px 14px" }}>
              ? Change Role
            </button>
          </div>
        ) : null}

        {selectedRole === "responder" ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12, textAlign: "left" }}>
            <h2 style={{ margin: 0, textAlign: "center" }}>Responder Login</h2>
            <label style={{ display: "grid", gap: 6 }}>
              Staff ID
              <input value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="staff_1" />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              Department
              <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="Security">Security</option>
                <option value="Medical">Medical</option>
              </select>
            </label>
            <button onClick={handleResponderLogin} style={{ padding: "10px 14px" }}>
              Login as Responder
            </button>
            <button onClick={goBack} style={{ padding: "10px 14px" }}>
              ? Change Role
            </button>
          </div>
        ) : null}

        {selectedRole === "admin" ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12, textAlign: "left" }}>
            <h2 style={{ margin: 0, textAlign: "center" }}>Admin Login</h2>
            <label style={{ display: "grid", gap: 6 }}>
              Admin Code
              <input
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Enter code"
              />
            </label>
            <button onClick={handleAdminLogin} style={{ padding: "10px 14px" }}>
              Login as Admin
            </button>
            <button onClick={goBack} style={{ padding: "10px 14px" }}>
              ? Change Role
            </button>
          </div>
        ) : null}

        {error ? <p className="error" style={{ marginTop: 12 }}>{error}</p> : null}
      </section>
    </main>
  );
}

export default Login;
