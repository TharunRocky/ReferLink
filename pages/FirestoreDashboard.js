import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

/**
 * Estimate size in bytes for a document
 */
function getDocumentSize(docData) {
  const dataStr = JSON.stringify(docData);
  return new TextEncoder().encode(dataStr).length;
}

/**
 * Estimate storage for a top-level collection (Web safe)
 */
async function estimateCollectionSize(collectionRef) {
  const snapshot = await getDocs(collectionRef);
  let totalBytes = 0;

  snapshot.forEach((doc) => {
    totalBytes += getDocumentSize(doc.data());
  });

  return totalBytes;
}

export default function FirestoreStorageDashboard() {
  const [usage, setUsage] = useState({});
  const [total, setTotal] = useState(0);
  const collections = ["messages", "jobRequests","jobOpenings"]; // Add your top-level collections

  useEffect(() => {
    async function calculateUsage() {
      let grandTotal = 0;
      const usageData = {};

      for (const colName of collections) {
        const colRef = collection(db, colName);
        const size = await estimateCollectionSize(colRef);
        usageData[colName] = size;
        grandTotal += size;
      }

      setUsage(usageData);
      setTotal(grandTotal);
    }

    calculateUsage();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Firestore Storage Usage (Approximate)</h2>
      <ul>
        {Object.entries(usage).map(([col, bytes]) => (
          <li key={col}>
            <b>{col}:</b> {(bytes / 1024).toFixed(2)} KB
          </li>
        ))}
      </ul>
      <h3>Total: {(total / 1024 / 1024).toFixed(2)} MB</h3>
      <p style={{ fontSize: "12px", color: "#555" }}>
        ⚠️ Approximate. Only top-level collections. Does not include subcollections, metadata, or indexes.
      </p>
    </div>
  );
}
