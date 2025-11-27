"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NotificationSettings() {
  const [days, setDays] = useState("");

  const handleSubmit = async () => {
    if(days===""){
      toast.error("Please Enter no. of days");
      return;
    }
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
      <div className="border rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-2">Notifications </h3>
              <p className="text-sm text-gray-600 mb-4">
                Delete old notifications based on the number of days
              </p>
    <div className="space-y-4 max-w-md">
      <Input
        type="number"
        placeholder="Delete chat older than"
        value={days}
        onChange={(e) => setDays(e.target.value)}
      />

      <Button className="w-full" onClick={handleSubmit}>
        Delete Notifications
      </Button>
    </div>
    </div>
  );
}
