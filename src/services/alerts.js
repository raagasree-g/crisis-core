import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const ALERTS = "alerts";

const NEXT_STATUS = {
  new: "in_progress",
  in_progress: "resolved",
};

export function getNextStatusLabel(status) {
  if (status === "new") return "Start Response";
  if (status === "in_progress") return "Mark Resolved";
  return "";
}

export async function createAlert({ type, room, note }) {
  return addDoc(collection(db, ALERTS), {
    type,
    room,
    note: note || "",
    status: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeAlerts(onData, onError) {
  const alertsQuery = query(collection(db, ALERTS), orderBy("createdAt", "desc"));

  return onSnapshot(
    alertsQuery,
    (snapshot) => {
      const alertList = snapshot.docs.map((alertDoc) => ({ id: alertDoc.id, ...alertDoc.data() }));
      onData(alertList);
    },
    onError,
  );
}

export async function updateAlertStatus(alertId, currentStatus) {
  const nextStatus = NEXT_STATUS[currentStatus];

  if (!nextStatus) {
    throw new Error("No next status available");
  }

  const payload = {
    status: nextStatus,
    updatedAt: serverTimestamp(),
  };

  if (nextStatus === "resolved") {
    payload.resolvedAt = serverTimestamp();
  }

  await updateDoc(doc(db, ALERTS, alertId), payload);
}
