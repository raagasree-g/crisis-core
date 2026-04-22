import { useState } from "react";

const ORG_TYPES = [
  "Hotel",
  "School",
  "College",
  "University",
  "Hospital",
  "Apartment",
  "Office",
  "Event",
  "Exhibition",
  "Mall",
  "Resort",
  "Stadium",
  "Airport",
  "Others",
];

function Login({ setRole }) {
  const [selectedOrgType, setSelectedOrgType] = useState(null);
  const [customOrg, setCustomOrg] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const [orgChoice, setOrgChoice] = useState("");

  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [staffId, setStaffId] = useState("");
  const [department, setDepartment] = useState("Security");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");

  const handleContinueOrg = () => {
    if (!orgChoice) {
      setError("Please select organization type.");
      return;
    }

    if (orgChoice === "Others" && !customOrg.trim()) {
      setError("Please enter your organization name.");
      return;
    }

    const orgType = orgChoice === "Others" ? customOrg.trim() : orgChoice;
    localStorage.setItem("organizationType", orgType);

    setSelectedOrgType(orgType);
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
    <main className="layout" style={{ gridTemplateColumns: "1fr", maxWidth: 560, placeItems: "center" }}>
      <section className="card" style={{ width: "100%", maxWidth: 500, textAlign: "center" }}>
        <h1 style={{ marginTop: 0 }}>Crisis Core Login</h1>

        {selectedOrgType === null ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <h2 style={{ margin: 0 }}>Select Organization Type</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              {ORG_TYPES.map((org) => (
                <button
                  key={org}
                  onClick={() => {
                    setOrgChoice(org);
                    setError("");
                  }}
                  style={{
                    padding: "10px 12px",
                    border: orgChoice === org ? "2px solid #0a58ca" : "1px solid #d0d7e2",
                  }}
                >
                  {org}
                </button>
              ))}
            </div>

            {orgChoice === "Others" ? (
              <label style={{ display: "grid", gap: 6, textAlign: "left" }}>
                What is your organization?
                <input
                  value={customOrg}
                  onChange={(e) => setCustomOrg(e.target.value)}
                  placeholder="Enter organization name"
                />
              </label>
            ) : null}

            <button onClick={handleContinueOrg} style={{ padding: "10px 14px" }}>
              Continue
            </button>
          </div>
        ) : null}

        {selectedOrgType !== null && selectedRole === null ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <h2 style={{ margin: 0 }}>Select Your Role</h2>
            <button onClick={() => { setSelectedRole("user"); setError(""); }} style={{ padding: "10px 14px" }}>
              Login as User
            </button>
            <button onClick={() => { setSelectedRole("responder"); setError(""); }} style={{ padding: "10px 14px" }}>
              Login as Responder
            </button>
            <button onClick={() => { setSelectedRole("admin"); setError(""); }} style={{ padding: "10px 14px" }}>
              Login as Admin
            </button>
            <button
              onClick={() => {
                setSelectedOrgType(null);
                setSelectedRole(null);
                setError("");
              }}
              style={{ padding: "10px 14px" }}
            >
              ? Back to Organization
            </button>
          </div>
        ) : null}

        {selectedOrgType !== null && selectedRole === "user" ? (
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
            <button onClick={handleUserLogin} style={{ padding: "10px 14px" }}>Login as Guest</button>
            <button onClick={() => { setSelectedRole(null); setError(""); }} style={{ padding: "10px 14px" }}>
              ? Back to Role Selection
            </button>
          </div>
        ) : null}

        {selectedOrgType !== null && selectedRole === "responder" ? (
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
            <button onClick={handleResponderLogin} style={{ padding: "10px 14px" }}>Login as Responder</button>
            <button onClick={() => { setSelectedRole(null); setError(""); }} style={{ padding: "10px 14px" }}>
              ? Back to Role Selection
            </button>
          </div>
        ) : null}

        {selectedOrgType !== null && selectedRole === "admin" ? (
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
            <button onClick={handleAdminLogin} style={{ padding: "10px 14px" }}>Login as Admin</button>
            <button onClick={() => { setSelectedRole(null); setError(""); }} style={{ padding: "10px 14px" }}>
              ? Back to Role Selection
            </button>
          </div>
        ) : null}

        {error ? <p className="error" style={{ marginTop: 12 }}>{error}</p> : null}
      </section>
    </main>
  );
}

export default Login;
