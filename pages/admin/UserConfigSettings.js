"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function useDebounce(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function UserConfigSettings() {
  const [status, setStatus] = useState("");
  const [username, setUsername] = useState("");
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [updated,setUpdated] = useState(true);

  const wrapperRef = useRef(null);

      // Fetch usernames from backend
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setAllUsers(data);  
      } catch (error) {
        console.log(error);
        toast.error("Failed to load usernames");
      }
    }
        fetchUsers();
  }, [updated]);


  const debouncedSearch = useDebounce(search);

  const filteredUsers = useMemo(() => {
    if (!status) return [];

      const searchText = (debouncedSearch || "").trim(); // ✅ Ensure string

    if(status === 'APPROVED' || status === 'PENDING') {
      return allUsers
        .filter((u) => u.status === status)
        .filter((u) =>
          u.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    else if(status === 'ADMIN' || status === 'USER'){
      return allUsers
        .filter((u) => u.role === status)
        .filter((u) =>
          u.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email.toLowerCase().includes(searchText.toLowerCase())
        );
    }
  }, [status, debouncedSearch]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setUsername("");
    setSearch("");
    setDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    if(e.target.value.trim() === ""){
      setUsername("");
    }
    setDropdownOpen(true);
  };

  const handleSelectUser = (user) => {
    setUsername(user.email);
    setSearch(user.email);
    setDropdownOpen(false);
  };

  const resetData = () => {
    setUsername("");
    setSearch("");
    setStatus("");
  }


      const handleSubmit = async () => {
      if (!username || !status) {
        toast.error("Please select both status and username");
        return;
      }
      try {
        console.log("Making call for",username);
        const res = await fetch("/api/admin/update-user-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, status }),
        });

        if (res.ok) {
          toast.success("User config updated");
          resetData();
          setUpdated(!updated);
          
        } else {
          toast.error("Failed to update");
        }
      } catch {
        toast.error("Error updating user config");
      }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 max-w-md" ref={wrapperRef}>

      {/* STATUS SELECT */}
      <div>
        <label className="block mb-1 font-semibold">Select Status</label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select status</option>
          <option value="PENDING">Activate</option>
          <option value="APPROVED">Deactivate</option>
          <option value="USER">Make as Admin</option>
          <option value="ADMIN">Make as User</option>
        </select>
      </div>

      {/* INLINE AUTOCOMPLETE */}
      <div className="relative">
        <label className="block mb-1 font-semibold">Select Username</label>
        <input
          type="text"
          disabled={!status}
          value={search}
          onChange={handleInputChange}
          onFocus={() => setDropdownOpen(true)}
          placeholder={status ? "Search username..." : "Select status first"}
          className="w-full border rounded px-3 py-2"
          autoComplete="off"
        />

        {dropdownOpen && status && (
          <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {filteredUsers.length === 0 ? (
              <li className="p-2 text-gray-500 italic select-none">No users found.</li>
            ) : (
              filteredUsers.map((user) => (
                <li
                  key={user.email}
                  className={cn(
                    "cursor-pointer px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center gap-2",
                    username === user.email ? "bg-blue-600 text-white" : ""
                  )}
                  onClick={() => handleSelectUser(user)}
                >
                  {username === user.email && (
                    <Check className="h-4 w-4" />
                  )}
                  <div>
                    <div className="font-semibold">{user.fullName}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                    {/* <div className="text-xs text-gray-500">@{user.fullName}</div> */}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <Button className="w-full" onClick={handleSubmit}>
        Update User
      </Button>
    </div>
  );
}
