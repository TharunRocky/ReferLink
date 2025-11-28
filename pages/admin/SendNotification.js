"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function SendNotifications() {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSend = async () => {
    if (!topic || !title || !body) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("/api/sendTopic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, title, body }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Notification sent!");
        setTopic("");
        setTitle("");
        setBody("");
      } else {
        toast.error("Failed to send notification");
      }
    } catch (err) {
      toast.error("Error sending notification");
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-lg mb-2">Send Notifications</h3>
      <p className="text-sm text-gray-600 mb-4">
        Send a push notification to all users subscribed to a topic.
      </p>

      <div className="space-y-4 max-w-md">
        <Select onValueChange={(value) => setTopic(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="offers">Offers</SelectItem>
            <SelectItem value="alerts">Alerts</SelectItem>
          </SelectContent>
        </Select>
        {/* <Input
          type="text"
          placeholder="Topic (e.g., news)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        /> */}

        <Input
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Notification Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <Button className="w-full" onClick={handleSend}>
          Send Notification
        </Button>
      </div>
    </div>
  );
}