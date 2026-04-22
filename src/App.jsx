import "./App.css";
import SOS from "./SOS";
import Dashboard from "./Dashboard";

const role = "responder"; // change manually: "user" | "responder" | "admin"

function App() {
  return (
    <main className="layout" style={{ gridTemplateColumns: "1fr", maxWidth: 900 }}>
      <section className="card">
        <h1 style={{ marginTop: 0 }}>Crisis Core</h1>
        <p className="subtitle">Demo Role: {role}</p>

        {role === "user" ? <SOS demoRole={role} /> : null}
        {role === "responder" || role === "admin" ? <Dashboard demoRole={role} /> : null}
      </section>
    </main>
  );
}

export default App;
