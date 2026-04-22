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
  try {
    return await addDoc(collection(db, ALERTS), {
      type,
      room,
      note: note || "",
      status: "new",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("createAlert failed", error);
    throw error;
  }
}

export function subscribeAlerts(onData, onError) {
  try {
    const alertsQuery = query(collection(db, ALERTS), orderBy("createdAt", "desc"));

    return onSnapshot(
      alertsQuery,
      (snapshot) => {
        const alertList = snapshot.docs.map((alertDoc) => ({ id: alertDoc.id, ...alertDoc.data() }));
        onData(alertList);
      },
      (error) => {
        console.error("subscribeAlerts failed", error);
        onError(error);
      },
    );
  } catch (error) {
    console.error("subscribeAlerts setup failed", error);
    onError(error);
    return () => {};
  }
}

export async function updateAlertStatus(alertItem) {
  const nextStatus = NEXT_STATUS[alertItem.status];

  if (!nextStatus) {
    throw new Error("No next status available");
  }

  const payload = {
    status: nextStatus,
    updatedAt: serverTimestamp(),
  };

  if (nextStatus === "resolved") {
    payload.resolvedAt = serverTimestamp();
    console.log("Send to blockchain:", {
      id: alertItem.id,
      type: alertItem.type,
      room: alertItem.room,
      note: alertItem.note || "",
      createdAt: alertItem.createdAt || null,
      resolvedAt: "serverTimestamp()",
      status: nextStatus,
    });
  }

  try {
    await updateDoc(doc(db, ALERTS, alertItem.id), payload);
  } catch (error) {
    console.error("updateAlertStatus failed", error);
    throw error;
  }
}
