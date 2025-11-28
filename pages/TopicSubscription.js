"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useFcmToken } from "@/hooks/useFCMToken";

export default function UserTopicSubscribe() {
  const [topic, setTopic] = useState("");

  // const requestToken = async () => {
  //   try {
  //     const permission = await Notification.requestPermission();
  //     if (permission !== "granted") {
  //       toast.error("Please enable notifications to subscribe.");
  //       return null;
  //     }

  //     // Get FCM token from your firebase client code
  //     const { getToken, messaging } = await import("../utils/firebase");

  //     const token = await getToken(messaging, {
  //       vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  //     });

  //     return token;
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Unable to get device token");
  //     return null;
  //   }
  // };


  
    const { generateToken } = useFcmToken();
  
    // const handleSubscribe = async () => {
    //   const token = await generateToken();
    //   if (!token) return;
  
    //   await fetch("/api/subscribe", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ token, topic: "news" }),
    //   });
  
    //   alert("Subscribed to topic: news");
    // };
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
        toast.success(`Subscribed to ${topic} notifications`);
      } else {
        toast.error(data.error || "Failed to subscribe");
      }
    } catch (err) {
      toast.error("Error while subscribing");
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

        {/* Subscribe Button */}
        <Button className="w-full" onClick={handleSubscribe}>
          Subscribe
        </Button>

      </div>
    </div>
  );
}
