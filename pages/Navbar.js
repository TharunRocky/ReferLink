'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, LayoutDashboard, FileText, User,LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import MobileSidebar from "@/components/ui/MobileSidebar";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Navbar({ session,status,ChangeTab}) {
  if(!session) return null;
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState("home");

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
              <MobileSidebar session={session} ChangeTab={ChangeTab} /> JobSearch
            </p>
            
            <div className="hidden md:flex space-x-1">
              <p>
                <Button
                 onClick = {() => {
                        setTab("home")
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
                        setTab("my-posts")
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
                        setTab("admin")
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
                <p onClick = {() => {
                      setTab("home")
                      ChangeTab("postRequest")
                    }}>
                  <DropdownMenuItem data-testid="nav-post-request-link">
                    <FileText className="h-4 w-4 mr-2" />
                    Post Job Request
                  </DropdownMenuItem>
                </p>
                <p 
                    onClick = {() => {
                        setTab("home")
                        ChangeTab("postOpening")
                    }}>
                  <DropdownMenuItem data-testid="nav-post-opening-link">
                    <FileText className="h-4 w-4 mr-2" />
                    Post Job Opening
                  </DropdownMenuItem>
                </p>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" data-testid="nav-notifications-menu">
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
              <DropdownMenuContent align="end" className="w-80">
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
              </DropdownMenuContent>
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
