export async function sendTopicNotification({ topic, title, content }) {
  try {
    const res = await fetch("/api/sendTopic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, title, content }),
    });

    const data = await res.json();
    return { ok: res.ok, data };
  } catch (err) {
    console.error("Error sending topic message:", err);
    return { ok: false, error: err };
  }
}
