import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput, CommandEmpty } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TemporaryPasswordGenerator({ users }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
    const tempPswd = generateTempPassword();

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

        {/* 🔍 SEARCHABLE COMBOBOX */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selectedUser || "Select a user"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search users..." />

              <CommandEmpty>No users found.</CommandEmpty>

              <CommandGroup>
                {users.map((u) => (
                  <CommandItem
                    key={u.email}
                    value={u.email}
                    onSelect={() => {
                      setSelectedUser(u.email);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedUser === u.email ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {u.email}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* GENERATE BUTTON */}
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
