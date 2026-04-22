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
  const [showOrgDetails, setShowOrgDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [orgDetails, setOrgDetails] = useState({
    name: "",
    location: "",
    contact: "",
    capacity: "",
    extra: "",
  });

  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [staffId, setStaffId] = useState("");
  const [department, setDepartment] = useState("Security");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");

  const getExtraLabel = () => {
    if (selectedOrgType === "Hotel") return "Number of Floors";
    if (selectedOrgType === "Hospital") return "Number of Departments";
    if (selectedOrgType === "Event") return "Event Name";
    if (selectedOrgType === "Others") return "Describe Organization";
    return "";
  };

  const handleOrgSelect = (orgType) => {
    setSelectedOrgType(orgType);
    setShowOrgDetails(false);
    setSelectedRole(null);
    setError("");
  };

  const handleContinueOrgDetails = () => {
    const details = {
      name: orgDetails.name.trim(),
      location: orgDetails.location.trim(),
      contact: orgDetails.contact.trim(),
      capacity: orgDetails.capacity.trim(),
      extra: orgDetails.extra.trim(),
    };

    if (!details.name || !details.location || !details.contact || !details.capacity) {
      setError("Please fill all required organization details.");
      return;
    }

    localStorage.setItem("organizationType", selectedOrgType);
    localStorage.setItem(
      "organizationDetails",
      JSON.stringify({
        ...details,
        organizationType: selectedOrgType,
      }),
    );

    setShowOrgDetails(true);
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
            <p>Step: Org</p>
            <h2 style={{ margin: 0 }}>Select Organization Type</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
              {ORG_TYPES.map((org) => (
                <button
                  key={org}
                  onClick={() => handleOrgSelect(org)}
                  style={{
                    padding: "10px 12px",
                    border: selectedOrgType === org ? "2px solid #0a58ca" : "1px solid #d0d7e2",
                  }}
                >
                  {org}
                </button>
              ))}
            </div>
          </div>
        ) : !showOrgDetails ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12, textAlign: "left" }}>
            <p style={{ textAlign: "center" }}>Step: Details</p>
            <h2 style={{ margin: 0, textAlign: "center" }}>Enter Organization Details</h2>
            <label style={{ display: "grid", gap: 6 }}>
              Organization Name
              <input
                value={orgDetails.name}
                onChange={(e) => setOrgDetails((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter organization name"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              Location (City / Area)
              <input
                value={orgDetails.location}
                onChange={(e) => setOrgDetails((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              Contact Number
              <input
                value={orgDetails.contact}
                onChange={(e) => setOrgDetails((prev) => ({ ...prev, contact: e.target.value }))}
                placeholder="Enter contact number"
              />
            </label>
            <label style={{ display: "grid", gap: 6 }}>
              Capacity (number of people)
              <input
                type="number"
                value={orgDetails.capacity}
                onChange={(e) => setOrgDetails((prev) => ({ ...prev, capacity: e.target.value }))}
                placeholder="Enter capacity"
              />
            </label>

            {getExtraLabel() ? (
              <label style={{ display: "grid", gap: 6 }}>
                {getExtraLabel()}
                <input
                  value={orgDetails.extra}
                  onChange={(e) => setOrgDetails((prev) => ({ ...prev, extra: e.target.value }))}
                  placeholder={`Enter ${getExtraLabel().toLowerCase()}`}
                />
              </label>
            ) : null}

            <button onClick={handleContinueOrgDetails} style={{ padding: "10px 14px" }}>
              Continue
            </button>
            <button
              onClick={() => {
                setSelectedOrgType(null);
                setShowOrgDetails(false);
                setSelectedRole(null);
                setError("");
              }}
              style={{ padding: "10px 14px" }}
            >
              {"<- Back to Organization"}
            </button>
          </div>
        ) : selectedRole === null ? (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            <p>Step: Role</p>
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
                setShowOrgDetails(false);
                setSelectedRole(null);
                setError("");
              }}
              style={{ padding: "10px 14px" }}
            >
              {"<- Back to Organization Details"}
            </button>
          </div>
        ) : (
          <>
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
                <button onClick={handleUserLogin} style={{ padding: "10px 14px" }}>Login as Guest</button>
                <button onClick={() => { setSelectedRole(null); setError(""); }} style={{ padding: "10px 14px" }}>
                  {"<- Back to Role Selection"}
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
                <button onClick={handleResponderLogin} style={{ padding: "10px 14px" }}>Login as Responder</button>
                <button onClick={() => { setSelectedRole(null); setError(""); }} style={{ padding: "10px 14px" }}>
                  {"<- Back to Role Selection"}
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
                <button onClick={handleAdminLogin} style={{ padding: "10px 14px" }}>Login as Admin</button>
                <button onClick={() => { setSelectedRole(null); setError(""); }} style={{ padding: "10px 14px" }}>
                  {"<- Back to Role Selection"}
                </button>
              </div>
            ) : null}
          </>
        )}

        {error ? <p className="error" style={{ marginTop: 12 }}>{error}</p> : null}
      </section>
    </main>
  );
}

export default Login;
