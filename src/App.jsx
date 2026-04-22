import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { createAlert, getNextStatusLabel, subscribeAlerts, updateAlertStatus } from "./services/alerts";

const ALERT_TYPES = ["fire", "medical", "security", "other"];

function getDate(value) {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  if (value?.seconds) {
    return new Date(value.seconds * 1000);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function formatCreatedAt(value) {
  const date = getDate(value);
  if (!date) return "Just now";

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSeconds < 15) return "Just now";
  if (diffSeconds < 60) return `${diffSeconds} sec ago`;

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function getResponseTimeSeconds(createdAt, resolvedAt) {
  const created = getDate(createdAt);
  const resolved = getDate(resolvedAt);

  if (!created || !resolved) return null;

  const seconds = Math.max(0, Math.round((resolved.getTime() - created.getTime()) / 1000));
  return seconds;
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
      setRoom("");
      setNote("");
      setType("fire");
    } catch (error) {
      console.error(error);
      setErrorMessage("Could not send alert. Please retry.");
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (alertItem) => {
    if (updatingId) return;

    setUpdatingId(alertItem.id);
    setErrorMessage("");

    try {
      await updateAlertStatus(alertItem);
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
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              disabled={sending || Boolean(updatingId)}
            >
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
              disabled={sending || Boolean(updatingId)}
            />
          </label>

          <label>
            Note (optional)
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Smoke near corridor"
              maxLength={140}
              disabled={sending || Boolean(updatingId)}
            />
          </label>

          <button type="submit" disabled={sending || Boolean(updatingId)}>
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
              const responseSeconds = getResponseTimeSeconds(alertItem.createdAt, alertItem.resolvedAt);

              return (
                <li key={alertItem.id} className="alert-item">
                  <div>
                    <p className="title">{alertItem.type} | Room {alertItem.room}</p>
                    <p className={`status status-${alertItem.status}`}>{alertItem.status}</p>
                    <p className="meta">Created: {formatCreatedAt(alertItem.createdAt)}</p>
                    {alertItem.note ? <p className="meta">Note: {alertItem.note}</p> : null}
                    {responseSeconds !== null ? (
                      <p className="meta">Response Time: {responseSeconds} seconds</p>
                    ) : null}
                  </div>

                  {nextLabel ? (
                    <button
                      className="status-btn"
                      onClick={() => handleStatusUpdate(alertItem)}
                      disabled={Boolean(updatingId) || sending}
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
