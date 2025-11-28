// Updated Navbar with Bottom-Sheet Notifications
// --- Entire code replaced here ---

'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, LayoutDashboard, FileText, User, LogOut, Key, Save } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import MobileSidebar from "@/components/ui/MobileSidebar";
import { useFcmToken } from "@/hooks/useFCMToken";
import { unsubscribeFromAllTopics } from "@/hooks/unsubscribeFromAllTopics";

export default function Navbar({ session, status, ChangeTab, tab }) {
  if (!session) return null;

  const [notifications, setNotifications] = useState([]);
  const [changing, setChanging] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const notifScrollRef = useRef(null);
  const touchStartYRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    document.body.style.overflow = notifOpen ? "hidden" : "auto";
  }, [notifOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };


  const { generateToken } = useFcmToken();

  const subscribe = async () => {
    const token = await generateToken();
    if (!token) return;

    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, topic: "news" }),
    });

    alert("Subscribed to topic: news");
  };

  const handleLogout = async () => {
    await unsubscribeFromAllTopics(generateToken);

    signOut();
  };


  const handleWheel = (e) => {
    const el = notifScrollRef.current;
    if (!el) return;

    const isAtTop = el.scrollTop <= 0;

    if (isAtTop && e.deltaY > 0) {
      setNotifOpen(false);
    }
  };

  /* --------------------------------------------------------
     MOBILE DRAG — Close when pulling down from the top
  -------------------------------------------------------- */
  const handleTouchStart = (e) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    const el = notifScrollRef.current;
    if (!el) return;

    const startY = touchStartYRef.current;
    if (startY === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY; // positive = drag down

    const isAtTop = el.scrollTop <= 0;

    if (isAtTop && diff > 25) {
      setNotifOpen(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`api/notifications/read?id=${notificationId}`);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`api/notifications/read-all`);
      toast.success("All notifications marked as read");
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const handlePasswordSave = async () => {
    setLoading(true);
    setMessage("");

    if (!password) {
      setMessage("Please Enter password");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be atleast 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to update password");
      toast.success("Password updated!");
      setPassword("");
      setChanging(false);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <p className="text-2xl font-bold text-gray-900">
              <MobileSidebar session={session} ChangeTab={ChangeTab} tab={tab} /> JobSearch
            </p>

            <div className="hidden md:flex space-x-1">
              <Button onClick={() => ChangeTab("home")} variant={tab === "home" ? "default" : "ghost"}>Home</Button>
              <Button onClick={() => ChangeTab("my-posts")} variant={tab === "my-posts" ? "default" : "ghost"}>My Posts</Button>

              {session.user.role === "ADMIN" && (
                <>
                  <Button onClick={() => ChangeTab("admin")} variant={tab === "admin" ? "default" : "ghost"}>
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Admin
                  </Button>

                  <Button onClick={() => ChangeTab("advancedControls")} variant={tab === "advancedControls" ? "default" : "ghost"}>
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Advanced
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center space-x-4">
            {/* Add Post */}
            <div className="hidden md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon"><Plus className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => ChangeTab("postRequest")}><FileText className="h-4 w-4 mr-2" /> Post Job Request</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => ChangeTab("postOpening")}><FileText className="h-4 w-4 mr-2" /> Post Job Opening</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => ChangeTab("generalChat")}><FileText className="h-4 w-4 mr-2" /> General Chat</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => ChangeTab("profile")}><FileText className="h-4 w-4 mr-2" /> Profile</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => ChangeTab("subscribe")}><FileText className="h-4 w-4 mr-2" /> subscribe</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notifications Button */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setNotifOpen(true)}>
              <Bell className="h-5 w-5" />
              {notifications.some(n => !n.read) && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <div className="px-2 py-2">
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                  {session.user.role === "ADMIN" && <Badge className="mt-1">Admin</Badge>}
                </div>

                <DropdownMenuSeparator />

                {!changing && (
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => setChanging(true)}>
                    <Key className="h-4 w-4 mr-2" /> Change Password
                  </DropdownMenuItem>
                )}

                {changing && (
                  <div className="px-3 py-2 space-y-2">
                    <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <div className="flex justify-between gap-2">
                      <Button variant="outline" size="sm" onClick={() => setChanging(false)}>Cancel</Button>
                      <Button size="sm" onClick={handlePasswordSave} disabled={loading}><Save className="h-4 w-4 mr-2" /> Save</Button>
                    </div>

                    {message && <p className="text-xs text-green-600">{message}</p>}
                  </div>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Bottom-Sheet Notifications */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-[9999] flex items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotifOpen(false)}
          >
            <motion.div
              className="bg-white w-full max-h-[80vh] rounded-t-2xl shadow-xl p-4"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={handleWheel}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-lg">Notifications</p>
                {notifications.some(n => !n.read) && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all as read</Button>
                )}
              </div>

              {/* SCROLL AREA */}
              <div
                ref={notifScrollRef}
                className="overflow-y-auto max-h-[60vh] pr-1"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onWheel={handleWheel}
              >
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-gray-500 text-sm">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-3 border-b cursor-pointer ${!n.read ? "bg-blue-50" : ""}`}
                      onClick={() => !n.read && markAsRead(n.id)}
                    >
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
