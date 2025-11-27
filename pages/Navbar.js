'use client';

import { useState, useEffect } from "react";
import axios from "axios";
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
import { Bell, Plus, LayoutDashboard, FileText, User,LogOut, Key, Save } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import MobileSidebar from "@/components/ui/MobileSidebar";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Navbar({ session,status,ChangeTab, tab}) {
  if(!session) return null;
  const [notifications, setNotifications] = useState([]);
  const [changing, setChanging] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [notifOpen, setNotifOpen] =useState(false);

    useEffect(() => {
        fetchNotifications();
      }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  
  const handlePasswordSave = async () => {
    setLoading(true);
    setMessage("");
    
    if (!password){
      setMessage("Please Enter password");
      setLoading(false);
      return;
    }
    if(password.length < 8){
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

  const markAsRead = async (notificationId) => {
    try {
        await fetch(`api/notifications/read?id=${notificationId}`);
        setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('api/notifications/read-all');
      toast.success("All notifications marked as read");
      setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
    } catch (error) {x` `
      toast.error("Failed to mark all as read");
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
              <p>
                <Button
                 onClick = {() => {
                        ChangeTab("home")
                    }}
                  variant={tab === "home" ? "default" : "ghost"}
                  data-testid="nav-home-link"
                >
                  Home
                </Button>
              </p>
              <p>
                <Button
                    onClick = {() => {
                        ChangeTab("my-posts")
                    }}
                  variant={tab ==="my-posts" ? "default" : "ghost"}
                  data-testid="nav-my-posts-link"
                >
                  My Posts
                </Button>
              </p>
              {session.user.role === "ADMIN" && (
                <p >
                  <Button
                    onClick = {() => {
                        ChangeTab("admin")
                    }}
                    variant={tab === "admin" ? "default" : "ghost"}
                    data-testid="nav-admin-link"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </p>
              )}

              {session.user.role === "ADMIN" && (
                <p >
                  <Button
                    onClick = {() => {
                        ChangeTab("advancedControls")
                    }}
                    variant={tab === "advancedControls" ? "default" : "ghost"}
                    data-testid="nav-advancedControls-link"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="nav-post-menu">
                  <Plus className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div onClick = {() => {
                      ChangeTab("postRequest")
                    }}>
                  <DropdownMenuItem data-testid="nav-post-request-link">
                    <FileText className="h-4 w-4 mr-2" />
                    Post Job Request
                  </DropdownMenuItem>
                </div>
                <div 
                    onClick = {() => {
                        ChangeTab("postOpening")
                    }}>
                  <DropdownMenuItem data-testid="nav-post-opening-link">
                    <FileText className="h-4 w-4 mr-2" />
                    Post Job Opening
                  </DropdownMenuItem>
                </div>
                <div 
                    onClick = {() => {
                        ChangeTab("generalChat")
                    }}>
                  <DropdownMenuItem data-testid="nav-general-chat-link">
                    <FileText className="h-4 w-4 mr-2" />
                    GeneralChat
                  </DropdownMenuItem>
                </div>
                <div 
                    onClick = {() => {
                        ChangeTab("profile")
                    }}>
                  <DropdownMenuItem data-testid="nav-general-chat-link">
                    <FileText className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" data-testid="nav-notifications-menu" onClick={()=> setNotifOpen(true)}>
                  <Bell className="h-5 w-5" />
                  {notifications && (notifications.filter(n => !n.read)?.length ?? 0 ) > 0 && (
                    <Badge
                      data-testid="notification-badge"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                     {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              {/* <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-2">
                  <p className="font-semibold">Notifications</p>
                  {notifications && notifications.filter(n => !n.read).length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      data-testid="mark-all-read-button"
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {!notifications || notifications.length === 0 ? (
                    <div className="px-2 py-4 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        data-testid={`notification-${notification.id}`}
                        className={`px-2 py-3 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="ml-2 h-2 w-2 bg-blue-500 rounded-full" />
                        )}
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent> */}
              {notifOpen && (
                <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setNotifOpen(false)}>
                <div
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg p-5 max-h-[80vh] overflow-y-auto animate-slideUp"
                onClick={(e) => e.stopPropagation()}
                >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />


                <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Notifications</h2>
                {notifications.filter(n => !n.read).length > 0 && (
                <Button size="sm" variant="ghost" onClick={markAllAsRead}>Mark all as read</Button>
                )}
                </div>


                <div className="space-y-3">
                {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-6">No notifications</p>
                ) : (
                notifications.map((n) => (
                <div
                key={n.id}
                className={`p-3 rounded-lg border cursor-pointer ${!n.read ? "bg-blue-50 border-blue-200" : "bg-white"}`}
                onClick={() => !n.read && markAsRead(n.id)}
                >
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                ))
                )}
                </div>
                </div>
                </div>
                )}
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="nav-user-menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-2">
                  <p className="font-medium">{session.user.name}</p>
                  <p className="text-sm text-gray-500">{session.user.email}</p>
                  {session.user.role === "ADMIN" && (
                    <Badge className="mt-1">Admin</Badge>
                  )}
                </div>

                   <DropdownMenuSeparator />
            {!changing && (
              <DropdownMenuItem  onSelect={(e) => e.preventDefault()} onClick={() => setChanging(true)}>
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </DropdownMenuItem>
            )}

            {changing && (
          <div className="px-3 py-2 space-y-2">
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChanging(false)}
              >
                Cancel
              </Button>

              <Button size="sm" onClick={handlePasswordSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            {message && (
              <p className="text-xs text-green-600">{message}</p>
            )}
          </div>
        )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} data-testid="nav-logout-button">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
