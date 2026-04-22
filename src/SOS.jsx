import { useMemo, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function SOS({ role }) {
  const [type, setType] = useState("fire");
  const [roomInput, setRoomInput] = useState(localStorage.getItem("room") || "");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const lastSubmitRef = useRef({ key: "", at: 0 });

  const isUser = useMemo(() => role === "user", [role]);
  const userName = localStorage.getItem("userName") || "Guest";
  const savedRoom = localStorage.getItem("room") || "";
  const room = savedRoom || roomInput;

  const handleCreateAlert = async (event) => {
    event.preventDefault();
    if (!isUser || sending) return;

    const cleanRoom = room.trim();
    const cleanNote = note.trim();

    if (!cleanRoom) {
      setError("Room is required.");
      return;
    }

    const key = `${type}|${cleanRoom}|${cleanNote}|${userName}`;
    const now = Date.now();
    if (lastSubmitRef.current.key === key && now - lastSubmitRef.current.at < 2500) {
      return;
    }

    setSending(true);
    setError("");
    setMessage("");

    try {
      await addDoc(collection(db, "alerts"), {
        type,
        room: cleanRoom,
        note: cleanNote,
        userName,
        status: "NEW",
        assignedTo: null,
        createdAt: serverTimestamp(),
        acceptedAt: null,
        resolvedAt: null,
      });

      localStorage.setItem("room", cleanRoom);
      lastSubmitRef.current = { key, at: now };
      setMessage("SOS alert sent.");
      setType("fire");
      setRoomInput(cleanRoom);
      setNote("");
    } catch (err) {
      console.error("Failed to create alert", err);
      setError("Failed to send SOS. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (!isUser) {
    return <p style={{ padding: 8 }}>Only users can create alerts.</p>;
  }

  return (
    <section style={{ background: "#fff", border: "1px solid #e4e9f3", borderRadius: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0 }}>SOS Alert</h2>
      <form onSubmit={handleCreateAlert} style={{ display: "grid", gap: 10 }}>
        <label>
          Alert Type
          <select value={type} onChange={(e) => setType(e.target.value)} disabled={sending}>
            <option value="fire">fire</option>
            <option value="medical">medical</option>
            <option value="security">security</option>
            <option value="other">other</option>
          </select>
        </label>

        <label>
          Room
          <input
            value={room}
            onChange={(e) => setRoomInput(e.target.value)}
            placeholder="203"
            maxLength={10}
            disabled={sending || Boolean(savedRoom)}
          />
        </label>

        <label>
          Note
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Smoke near corridor"
            maxLength={140}
            disabled={sending}
          />
        </label>

        <button type="submit" disabled={sending} style={{ padding: "10px 14px" }}>
          {sending ? "Sending..." : "Send SOS"}
        </button>
      </form>

      {message ? <p style={{ color: "#117333", marginTop: 10 }}>{message}</p> : null}
      {error ? <p style={{ color: "#c81e1e", marginTop: 10 }}>{error}</p> : null}
    </section>
  );
}

export default SOS;
