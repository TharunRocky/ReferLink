'use client';

export async function unsubscribeFromAllTopics(generateToken) {

    const token = await generateToken();
    if (!token) return;

    let topics;
    try {
        topics = JSON.parse(localStorage.getItem("subscribedTopics") || "[]");
    } catch (e) {
        topics = [];
    }

    if (!Array.isArray(topics) || topics.length === 0) return;

    // Unsubscribe from each topic
    await Promise.all(
        topics.map((topic) =>
        fetch("/api/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, topic }),
        })
        )
    );

    // Clear local storage
    localStorage.removeItem("subscribedTopics");
}
