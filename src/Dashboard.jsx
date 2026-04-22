import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

function toDate(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeStatus(status) {
  const upper = (status || "").toUpperCase();
  if (upper === "NEW" || upper === "IN_PROGRESS" || upper === "RESOLVED") return upper;
  if (upper === "IN PROGRESS") return "IN_PROGRESS";
  return "NEW";
}

function formatCreatedTime(createdAt) {
  const created = toDate(createdAt);
  if (!created) return "Just now";

  const diffSec = Math.floor((Date.now() - created.getTime()) / 1000);
  if (diffSec < 15) return "Just now";
  if (diffSec < 60) return `${diffSec} sec ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;

  return created.toLocaleString();
}

function getResponseSeconds(createdAt, resolvedAt) {
  const c = toDate(createdAt);
  const r = toDate(resolvedAt);
  if (!c || !r) return null;
  return Math.max(0, Math.round((r.getTime() - c.getTime()) / 1000));
}

function getBorderColor(status) {
  if (status === "NEW") return "#d93025";
  if (status === "IN_PROGRESS") return "#b26d00";
  if (status === "RESOLVED") return "#117333";
  return "#d0d7e2";
}

function Dashboard({ role }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const staffId = localStorage.getItem("staffId") || "staff_1";

  useEffect(() => {
    const alertsQuery = query(collection(db, "alerts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      alertsQuery,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setAlerts(list);
        setLoading(false);
      },
      (err) => {
        console.error("Dashboard snapshot error", err);
        setError("Failed to load alerts.");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const normalizedAlerts = useMemo(
    () => alerts.map((a) => ({ ...a, normalizedStatus: normalizeStatus(a.status) })),
    [alerts],
  );

  const visibleAlerts = useMemo(() => {
    if (role === "responder") {
      return normalizedAlerts.filter((a) => a.normalizedStatus !== "RESOLVED");
    }
    return normalizedAlerts;
  }, [normalizedAlerts, role]);

  const totals = useMemo(() => {
    const total = normalizedAlerts.length;
    const active = normalizedAlerts.filter((a) => a.normalizedStatus !== "RESOLVED").length;
    const resolved = normalizedAlerts.filter((a) => a.normalizedStatus === "RESOLVED").length;
    return { total, active, resolved };
  }, [normalizedAlerts]);

  const startResponse = async (alert) => {
    if (updatingId || role !== "responder") return;

    setUpdatingId(alert.id);
    setError("");

    try {
      await updateDoc(doc(db, "alerts", alert.id), {
        status: "IN_PROGRESS",
        assignedTo: staffId,
        acceptedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Start response failed", err);
      setError("Failed to start response.");
    } finally {
      setUpdatingId("");
    }
  };

  const markResolved = async (alert) => {
    if (updatingId || role !== "responder") return;

    setUpdatingId(alert.id);
    setError("");

    try {
      await updateDoc(doc(db, "alerts", alert.id), {
        status: "RESOLVED",
        resolvedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Resolve failed", err);
      setError("Failed to mark resolved.");
    } finally {
      setUpdatingId("");
    }
  };

  if (role === "user") {
    return <p style={{ padding: 8 }}>Dashboard is not available for user role.</p>;
  }

  return (
    <section
      style={{
        background: role === "admin" ? "#f8fbff" : "#fffaf8",
        border: "1px solid #e4e9f3",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>
          {role === "admin" ? "Control Room Dashboard" : "Responder Dashboard"}
        </h2>
        <span style={{ background: "#e8f1ff", color: "#0a58ca", borderRadius: 999, padding: "4px 10px" }}>
          Active Alerts: {totals.active}
        </span>
      </div>

      {role === "admin" ? (
        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ background: "#eef2ff", padding: "4px 10px", borderRadius: 999 }}>Total Alerts: {totals.total}</span>
          <span style={{ background: "#fff4e5", padding: "4px 10px", borderRadius: 999 }}>Active Alerts: {totals.active}</span>
          <span style={{ background: "#eafaf0", padding: "4px 10px", borderRadius: 999 }}>Resolved Alerts: {totals.resolved}</span>
        </div>
      ) : null}

      {error ? <p style={{ color: "#c81e1e" }}>{error}</p> : null}
      {loading ? <p>Loading alerts...</p> : null}

      {!loading && visibleAlerts.length === 0 ? <p>No alerts found.</p> : null}

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {visibleAlerts.map((alert) => {
          const responseSec = getResponseSeconds(alert.createdAt, alert.resolvedAt);
          const isBusy = updatingId === alert.id;
          const status = alert.normalizedStatus;
          const handledByOther = alert.assignedTo && alert.assignedTo !== staffId;

          return (
            <li
              key={alert.id}
              style={{
                border: `2px solid ${getBorderColor(status)}`,
                borderRadius: 10,
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>{alert.type} | Room {alert.room}</p>
                <p style={{ margin: "4px 0", fontSize: 12 }}>Status: {status}</p>
                <p style={{ margin: "4px 0", fontSize: 12 }}>Guest: {alert.userName || "Unknown"}</p>
                <p style={{ margin: "4px 0", fontSize: 12 }}>Created: {formatCreatedTime(alert.createdAt)}</p>
                <p style={{ margin: "4px 0", fontSize: 12 }}>Note: {alert.note || "-"}</p>
                <p style={{ margin: "4px 0", fontSize: 12 }}>Assigned To: {alert.assignedTo || "Unassigned"}</p>

                {role === "admin" && status === "RESOLVED" && responseSec !== null ? (
                  <p style={{ margin: "4px 0", fontSize: 12, fontWeight: 600 }}>
                    Response Time: {responseSec} seconds
                  </p>
                ) : null}

                {role === "responder" && handledByOther ? (
                  <p style={{ margin: "4px 0", fontSize: 12, color: "#b26d00" }}>
                    Handled by {alert.assignedTo}
                  </p>
                ) : null}
              </div>

              {role === "responder" ? (
                <div>
                  {status === "NEW" ? (
                    <button
                      onClick={() => startResponse(alert)}
                      disabled={Boolean(updatingId) || handledByOther}
                      style={{ padding: "8px 12px" }}
                    >
                      {isBusy ? "Updating..." : "Start Response"}
                    </button>
                  ) : null}

                  {status === "IN_PROGRESS" ? (
                    <button
                      onClick={() => markResolved(alert)}
                      disabled={Boolean(updatingId) || handledByOther || alert.assignedTo !== staffId}
                      style={{ padding: "8px 12px" }}
                    >
                      {isBusy ? "Updating..." : "Mark Resolved"}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Dashboard;
