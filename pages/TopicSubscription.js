"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useFcmToken } from "@/hooks/useFCMToken";

export default function UserTopicSubscribe() {
  const [topic, setTopic] = useState("");
  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const { generateToken } = useFcmToken();

  // Load subscribed topics from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("subscribedTopics") || "[]");
    setSubscribedTopics(saved);
  }, []);

  // Helper: Save topics to localStorage
  const updateLocalTopics = (topics) => {
    localStorage.setItem("subscribedTopics", JSON.stringify(topics));
    setSubscribedTopics(topics);
  };

  const handleSubscribe = async () => {
    if (!topic) {
      toast.error("Please select a topic");
      return;
    }

    const token = await generateToken();
    if (!token) return;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, topic }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Subscribed to ${topic}`);
        updateLocalTopics([...subscribedTopics, topic]);
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch {
      toast.error("Error while subscribing");
    }
  };

  const handleUnsubscribe = async (t) => {
    const token = await generateToken();
    if (!token) return;

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, topic: t }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Unsubscribed from ${t}`);
        updateLocalTopics(subscribedTopics.filter((item) => item !== t));
      } else {
        toast.error(data.error || "Failed to unsubscribe");
      }
    } catch {
      toast.error("Error while unsubscribing");
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-lg mb-2">Subscribe to Notifications</h3>
      <p className="text-sm text-gray-600 mb-4">
        Choose a topic to receive notifications for.
      </p>

      <div className="space-y-4 max-w-md">
        {/* Topic Dropdown */}
        <Select onValueChange={setTopic}>
          <SelectTrigger>
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="offers">Offers</SelectItem>
            <SelectItem value="alerts">Alerts</SelectItem>
          </SelectContent>
        </Select>

        {/* Subscribe Button */}
        <Button className="w-full" onClick={handleSubscribe}>
          Subscribe
        </Button>
      </div>

      {/* Subscribed Topics List */}
      {subscribedTopics.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Your Subscriptions</h4>
          <div className="space-y-2">
            {subscribedTopics.map((t) => (
              <div
                key={t}
                className="flex items-center justify-between p-3 bg-gray-100 rounded"
              >
                <span className="font-medium">{t}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUnsubscribe(t)}
                >
                  Unsubscribe
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
