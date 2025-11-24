"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare,Linkedin, Edit } from "lucide-react";

export default function ProfileUpdateCard({session, profile, setProfile}) {
    if(!session) return null;
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);


  function handleChange(e) {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  // ⭐ ADDED — Save API call placeholder
  async function handleSave() {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Save failed");

      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#eef3ff] flex items-center justify-center px-4">
      <div className="relative bg-white rounded-xl max-w-md w-full pt-20 pb-16 px-8 shadow-xl text-center">
        
        {/* Profile Image */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-200">
          <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
        </div>

        {/* Edit Button */}
        {session.user.email === profile.email && (
        <button
          onClick={() => setEditMode((v) => !v)}
          className="absolute top-6 right-6 text-pink-500 font-semibold hover:underline"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
        )}

        {/* Full Name */}
        {editMode ? (
          <input
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="mt-4 w-full text-center font-semibold text-2xl text-gray-800 border-b-2 border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
            placeholder="Full Name"
          />
        ) : (
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">{profile.fullName}</h1>
        )}

        {/* Email */}
        <p className="mt-1 text-gray-500">{profile.email}</p>

        {/* Company */}
        {editMode ? (
          <input
            name="company"
            value={profile.company}
            onChange={handleChange}
            className="mt-4 w-full text-center text-gray-700 border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-pink-400"
            placeholder="Company"
          />
        ) : (
          <p className="mt-4 text-gray-700">{profile.company}</p>
        )}

        {editMode && (
          <input
            name="linkedinProfile"
            value={profile.linkedinProfile}
            onChange={handleChange}
            className="mt-4 w-full text-center text-gray-700 border-b border-gray-300 focus:outline-none focus:ring-1 focus:ring-pink-400"
            placeholder="LinkedIn Profile URL"
          />
        
        )}

        {/* Bio */}
        {editMode ? (
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={4}
            className="mt-4 w-full resize-none border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-pink-400"
            placeholder="Bio"
          />
        ) : (
          <p className="mt-4 text-gray-600 whitespace-pre-wrap">{profile.bio}</p>
        )}

                {/* Bottom LinkedIn + Message */}
        {!editMode && (
        <div className="mt-8 flex flex-col items-center gap-2">

        <div className="flex items-center gap-3">
            {/* LinkedIn Connect Button */}
            <a
            href={profile.linkedinProfile}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
            <Linkedin size={18} />
            <span className="text-sm">Connect</span>
            </a>

            {/* Send Message Icon */}
            <button
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
            title="Send Message"
            >
            <MessageSquare size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600">Message</span>
            </button>

        </div>

        {/* End Message (small text) */}
        <p className="text-gray-500 text-xs">
            Connect on LinkedIn or send a quick message.
        </p>

        </div>
            )}

        

        {/* ⭐ ADDED — Save Button */}
        {editMode && (
          <button
            onClick={handleSave}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
}
