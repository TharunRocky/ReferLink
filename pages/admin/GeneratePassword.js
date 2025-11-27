import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function TemporaryPasswordGenerator({users}) {
  const [selectedUser, setSelectedUser] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);

function generateTempPassword(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

  const handleGenerate = async () => {
    if (!selectedUser) {
      alert("Please select a user.");
      return;
    }

    setLoading(true);
    const tempPswd=generateTempPassword();

    try {
      const res = await fetch(`/api/admin/generate-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: selectedUser, password: tempPswd }),
      });

      const data = await res.json();

      setGenerated({ username: selectedUser, password: tempPswd });
    } catch (error) {
      console.error("Error generating password", error);
    }

    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-lg mb-2">Temporary Password Generator</h3>
      <p className="text-sm text-gray-600 mb-4">
        Generate a temporary password for the selected user
      </p>

      <div className="space-y-4 max-w-md">
        <Select onValueChange={setSelectedUser}>
          <SelectTrigger>
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.length === 0 ? (
              <li className="p-2 text-gray-500 italic select-none">No users found.</li>
            ) : (
            users.map((u) => (
              <SelectItem key={u.email} value={u.email}>
                {u.email}
              </SelectItem>
            )))}
          </SelectContent>
        </Select>

        <Button className="w-full" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Password"}
        </Button>

        {generated && (
          <div className="p-3 border rounded-lg bg-gray-50">
            <p><strong>Username:</strong> {generated.username}</p>
            <p><strong>Password:</strong> {generated.password}</p>
          </div>
        )}
      </div>
    </div>
  );
}
