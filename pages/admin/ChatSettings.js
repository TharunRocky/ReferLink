'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DeleteChatsRange() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDelete = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both dates.");
      return;
    }
    try {
      const res = await fetch("/api/admin/delete-chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      });

      const data=await res.json();

      if (res.ok) {
        toast.success(data.message);
        setStartDate("");
        setEndDate("");
      } else {
        toast.error("Failed to delete chat history");
      }
    } 
    catch (err) {
      toast.error("Error deleting chats");
    }
    console.log("Deleting chats from:", startDate, "to", endDate);
  };

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-lg mb-2">Delete Chats</h3>
      <p className="text-sm text-gray-600 mb-4">Delete chats within a selected date range</p>

      <div className="space-y-4 max-w-md">
        <Input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Button className="w-full" onClick={handleDelete}>
          Delete Chats
        </Button>
      </div>
    </div>
  );
}