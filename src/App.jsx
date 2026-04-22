import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { createAlert, getNextStatusLabel, subscribeAlerts, updateAlertStatus } from "./services/alerts";

const ALERT_TYPES = ["fire", "medical", "security", "other"];

function formatDate(value) {
  if (!value) return "Just now";

  const date = typeof value?.toDate === "function"
    ? value.toDate()
    : new Date(value.seconds ? value.seconds * 1000 : value);

  if (Number.isNaN(date.getTime())) return "Just now";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function App() {
  const [type, setType] = useState("fire");
  const [room, setRoom] = useState("");
  const [note, setNote] = useState("");

  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const [sending, setSending] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const lastSubmitRef = useRef({ signature: "", at: 0 });

  useEffect(() => {
    const unsubscribe = subscribeAlerts(
      (nextAlerts) => {
        setAlerts(nextAlerts);
        setLoadingAlerts(false);
      },
      (error) => {
        console.error(error);
        setErrorMessage("Live updates failed. Refresh and try again.");
        setLoadingAlerts(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const activeCount = useMemo(
    () => alerts.filter((alertItem) => alertItem.status !== "resolved").length,
    [alerts],
  );

  const handleSendSos = async (event) => {
    event.preventDefault();
    if (sending) return;

    const cleanRoom = room.trim();
    const cleanNote = note.trim();

    if (!cleanRoom) {
      setErrorMessage("Room number is required.");
      return;
    }

    const signature = `${type}|${cleanRoom}|${cleanNote}`;
    const now = Date.now();

    if (
      lastSubmitRef.current.signature === signature
      && now - lastSubmitRef.current.at < 2500
    ) {
      return;
    }

    setSending(true);
    setErrorMessage("");

    try {
      await createAlert({ type, room: cleanRoom, note: cleanNote });
      lastSubmitRef.current = { signature, at: now };
      setNote("");
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not send alert. Please retry.");
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (alertId, currentStatus) => {
    setUpdatingId(alertId);
    setErrorMessage("");

    try {
      await updateAlertStatus(alertId, currentStatus);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update status. Please retry.");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <main className="layout">
      <section className="card sos-card">
        <h1>Crisis Core</h1>
        <p className="subtitle">Real-time emergency response desk</p>

        <form className="sos-form" onSubmit={handleSendSos}>
          <label>
            Alert type
            <select value={type} onChange={(event) => setType(event.target.value)}>
              {ALERT_TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Room number
            <input
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              placeholder="203"
              maxLength={10}
              required
            />
          </label>

          <label>
            Note (optional)
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Smoke near corridor"
              maxLength={140}
            />
          </label>

          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send SOS"}
          </button>
        </form>
      </section>

      <section className="card dashboard-card">
        <div className="dashboard-header">
          <h2>Live Alert Dashboard</h2>
          <span className="badge">Active: {activeCount}</span>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        {loadingAlerts ? (
          <p className="muted">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <p className="muted">No alerts yet.</p>
        ) : (
          <ul className="alert-list">
            {alerts.map((alertItem) => {
              const nextLabel = getNextStatusLabel(alertItem.status);
              const isUpdating = updatingId === alertItem.id;

              return (
                <li key={alertItem.id} className="alert-item">
                  <div>
                    <p className="title">
                      Room {alertItem.room} - {alertItem.type}
                    </p>
                    <p className={`status status-${alertItem.status}`}>{alertItem.status}</p>
                    <p className="meta">Created: {formatDate(alertItem.createdAt)}</p>
                    {alertItem.note ? <p className="meta">Note: {alertItem.note}</p> : null}
                  </div>

                  {nextLabel ? (
                    <button
                      className="status-btn"
                      onClick={() => handleStatusUpdate(alertItem.id, alertItem.status)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : nextLabel}
                    </button>
                  ) : (
                    <span className="done">Closed</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
