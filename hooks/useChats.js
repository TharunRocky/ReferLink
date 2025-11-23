import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export default function useChats() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen to only the latest 100 messages
    const q = query(
      collection(db, "messages"),
      orderBy("timestamp", "asc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const addedMessages = [];
        const modifiedMessages = [];
        const removedIds = new Set();

        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          const msg = {
            _id: change.doc.id,
            ...data,
            timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp),
          };

          if (change.type === "added") addedMessages.push(msg);
          else if (change.type === "modified") modifiedMessages.push(msg);
          else if (change.type === "removed") removedIds.add(msg._id);
        });

        setMessages((prev) => {
          // 1️⃣ Remove deleted messages
          let updated = prev.filter((m) => !removedIds.has(m._id));

          // 2️⃣ Update modified messages
          modifiedMessages.forEach((mod) => {
            updated = updated.map((m) => (m._id === mod._id ? mod : m));
          });

          // 3️⃣ Append added messages without duplicates
          const existingIds = new Set(updated.map((m) => m._id));
          const uniqueAdded = addedMessages.filter((m) => !existingIds.has(m._id));

          // 4️⃣ Merge and sort by timestamp ascending
          const merged = [...updated, ...uniqueAdded].sort((a, b) => a.timestamp - b.timestamp);

          // 5️⃣ Ensure we only keep latest 100 messages
          return merged.slice(-100);
        });
      },
      (error) => {
        console.warn("Firestore listener error:", error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  return messages;
}
