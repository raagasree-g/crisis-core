import { useMemo, useState } from "react";

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

function roleLabel(role) {
  if (role === "user") return "User";
  if (role === "responder") return "Responder";
  if (role === "admin") return "Admin";
  return "";
}

function Login({ setRole }) {
  const storedName = localStorage.getItem("userName") || "";
  const storedPhone = localStorage.getItem("phone") || "";
  const storedOrg = localStorage.getItem("organizationType") || "";

  const [name, setName] = useState(storedName);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [selectedOrgType, setSelectedOrgType] = useState(storedOrg);
  const [customOrg, setCustomOrg] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  const [room, setRoom] = useState("");
  const [staffId, setStaffId] = useState("");
  const [department, setDepartment] = useState("Security");
  const [adminCode, setAdminCode] = useState("");

  const [error, setError] = useState("");

  const userInfoDone = Boolean(name.trim()) && Boolean(storedPhone);

  const activeUserName = localStorage.getItem("userName") || name.trim();
  const activeOrg = selectedOrgType || localStorage.getItem("organizationType") || "Organization";
  const bannerRole = selectedRole ? roleLabel(selectedRole) : "Role";

  function validatePhone() {
    const normalized = phone.trim();

    if (!normalized) {
      setError("Phone number is required");
      return false;
    }

    if (normalized.length < 8) {
      setError("Phone number too short");
      return false;
    }

    if (normalized.length > 15) {
      setError("Phone number too long");
      return false;
    }

    setError("");
    return true;
  }

  const handleContinueUserInfo = () => {
    const cleanName = name.trim();

    if (!cleanName) {
      setError("Name is required");
      return;
    }

    if (!validatePhone()) return;

    const fullPhone = `${countryCode}${phone.trim()}`;

    localStorage.setItem("userName", cleanName);
    localStorage.setItem("phone", fullPhone);
    setError("");
  };

  const handleContinueOrg = () => {
    const orgType = selectedOrgType === "Others" ? customOrg.trim() : selectedOrgType;

    if (!orgType) {
      setError("Please select organization");
      return;
    }

    localStorage.setItem("organizationType", orgType);
    setSelectedOrgType(orgType);
    setError("");
  };

  const handleUserLogin = () => {
    const cleanRoom = room.trim();

    if (!cleanRoom) {
      setError("Room number is required");
      return;
    }

    localStorage.setItem("role", "user");
    localStorage.setItem("room", cleanRoom);
    setRole("user");
  };

  const handleResponderLogin = () => {
    const cleanStaffId = staffId.trim();

    if (!cleanStaffId) {
      setError("Staff ID is required");
      return;
    }

    localStorage.setItem("role", "responder");
    localStorage.setItem("staffId", cleanStaffId);
    localStorage.setItem("department", department);
    setRole("responder");
  };

  const handleAdminLogin = () => {
    if (adminCode !== "1234") {
      setError("Invalid admin code");
      return;
    }

    localStorage.setItem("role", "admin");
    setRole("admin");
  };

  const loginForm = useMemo(() => {
    if (selectedRole === "user") {
      return (
        <div style={{ display: "grid", gap: 10, marginTop: 12, textAlign: "left" }}>
          <h2 style={{ margin: 0, textAlign: "center" }}>User Login</h2>
          <p style={{ margin: 0 }}><strong>Welcome, {activeUserName}</strong></p>
          <label style={{ display: "grid", gap: 6 }}>
            Room Number
            <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="203" />
          </label>
          <button onClick={handleUserLogin} style={{ padding: "10px 14px" }}>Enter System</button>
        </div>
      );
    }

    if (selectedRole === "responder") {
      return (
        <div style={{ display: "grid", gap: 10, marginTop: 12, textAlign: "left" }}>
          <h2 style={{ margin: 0, textAlign: "center" }}>Responder Login</h2>
          <p style={{ margin: 0 }}><strong>Welcome, {activeUserName}</strong></p>
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
          <button onClick={handleResponderLogin} style={{ padding: "10px 14px" }}>Enter System</button>
        </div>
      );
    }

    return (
      <div style={{ display: "grid", gap: 10, marginTop: 12, textAlign: "left" }}>
        <h2 style={{ margin: 0, textAlign: "center" }}>Admin Login</h2>
        <p style={{ margin: 0 }}><strong>Welcome, {activeUserName}</strong></p>
        <label style={{ display: "grid", gap: 6 }}>
          Admin Code
          <input
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Enter code"
          />
        </label>
        <button onClick={handleAdminLogin} style={{ padding: "10px 14px" }}>Enter System</button>
      </div>
    );
  }, [selectedRole, activeUserName, room, staffId, department, adminCode]);

  return (
    <main className="layout" style={{ gridTemplateColumns: "1fr", maxWidth: 560, placeItems: "center" }}>
      <section className="card" style={{ width: "100%", maxWidth: 500, textAlign: "center" }}>
        <h1 style={{ marginTop: 0 }}>Crisis Core Login</h1>

        {!userInfoDone ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12, textAlign: "left" }}>
            <h2 style={{ margin: 0, textAlign: "center" }}>Enter Your Details</h2>
            <label style={{ display: "grid", gap: 6 }}>
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Phone Number
              <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 8 }}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                >
                  <option value="+91">India (+91)</option>
                  <option value="+1">USA (+1)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+61">Australia (+61)</option>
                </select>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </label>

            <button onClick={handleContinueUserInfo} style={{ padding: "10px 14px" }}>
              Continue
            </button>
          </div>
        ) : !selectedOrgType ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <p>Welcome, {activeUserName}</p>
            <h2 style={{ margin: 0 }}>Select Organization Type</h2>

            <select
              value={selectedOrgType || ""}
              onChange={(e) => {
                setSelectedOrgType(e.target.value);
                setError("");
              }}
            >
              <option value="">Select organization</option>
              {ORG_TYPES.map((org) => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>

            {selectedOrgType === "Others" ? (
              <input
                placeholder="What is your organization?"
                value={customOrg}
                onChange={(e) => setCustomOrg(e.target.value)}
              />
            ) : null}

            <button onClick={handleContinueOrg} style={{ padding: "10px 14px" }}>
              Continue
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("userName");
                localStorage.removeItem("phone");
                setName("");
                setPhone("");
                setSelectedOrgType("");
                setError("");
              }}
              style={{ padding: "10px 14px" }}
            >
              {"<- Change User Details"}
            </button>
          </div>
        ) : !selectedRole ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <p>
              {localStorage.getItem("organizationType") || selectedOrgType} • Role • {activeUserName}
            </p>
            <h2 style={{ margin: 0 }}>Select Your Role</h2>

            <button onClick={() => { setSelectedRole("user"); setError(""); }} style={{ padding: "10px 14px" }}>
              User
            </button>
            <button onClick={() => { setSelectedRole("responder"); setError(""); }} style={{ padding: "10px 14px" }}>
              Responder
            </button>
            <button onClick={() => { setSelectedRole("admin"); setError(""); }} style={{ padding: "10px 14px" }}>
              Admin
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("organizationType");
                setSelectedOrgType("");
                setSelectedRole(null);
                setError("");
              }}
              style={{ padding: "10px 14px" }}
            >
              {"<- Change Organization"}
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            <p>
              {(localStorage.getItem("organizationType") || selectedOrgType)} • {roleLabel(selectedRole)} • {activeUserName}
            </p>
            {loginForm}

            <button
              onClick={() => {
                setSelectedRole(null);
                setError("");
              }}
              style={{ padding: "10px 14px" }}
            >
              Change Role
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("organizationType");
                setSelectedOrgType("");
                setSelectedRole(null);
                setError("");
              }}
              style={{ padding: "10px 14px" }}
            >
              Change Organization
            </button>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
    </main>
  );
}

export default Login;
