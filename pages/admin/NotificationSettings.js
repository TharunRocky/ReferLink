"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NotificationSettings() {
  const [days, setDays] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/admin/delete-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });

      const data=await res.json();

      if (res.ok) {
        toast.success(data.message);
        setDays("");
      } else {
        toast.error("Failed to delete notifications");
      }
    } catch (err) {
      toast.error("Error deleting notifications");
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <Input
        type="number"
        placeholder="Enter days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Delete Notifications
      </Button>
    </div>
  );
}
