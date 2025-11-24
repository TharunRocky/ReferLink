"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Bell,
  Home,
  FileText,
  Menu,
  LayoutDashboard,
  LogOut,
  User,
  CopyPlus,
} from "lucide-react";

import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export default function MobileSidebar({ session, ChangeTab }) {

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  if (!session) return null;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    await fetch(`/api/notifications/read?id=${id}`);
    fetchNotifications();
  };

  const markAllAsRead = async () => {
    await fetch(`/api/notifications/read-all`);
    toast.success("All marked as read");
    fetchNotifications();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Hamburger Button */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {/* Sidebar */}
      <SheetContent side="left" className="w-72 p-4">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">JobSearch</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              ChangeTab("home");
              setOpen(false);
            }}
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              ChangeTab("my-posts");
              setOpen(false);
            }}
          >
            <CopyPlus className="h-4 w-4 mr-2" />
            My Posts
          </Button>

          {session.user.role === "ADMIN" && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                ChangeTab("admin");
                setOpen(false);
              }}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          )}
          {session.user.role === "ADMIN" && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                ChangeTab("firestore");
                setOpen(false);
              }}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Firestore
            </Button>
          )}

          <DropdownMenuSeparator />

          {/* Post Actions */}
          <p className="font-semibold text-sm text-gray-500">Post Actions</p>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              ChangeTab("postRequest");
              setOpen(false);
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Post Job Request
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              ChangeTab("postOpening");
              setOpen(false);
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            Post Job Opening
          </Button>

          <DropdownMenuSeparator />

          {/* Post Actions */}
          <p className="font-semibold text-sm text-gray-500">Discussion Rooms</p>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              ChangeTab("generalChat");
              setOpen(false);
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            General Chat
          </Button>

          <DropdownMenuSeparator />

          {/* Notifications
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Notifications</p>
            {unreadCount > 0 && (
              <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto border rounded-md p-2">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-2">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-2 rounded cursor-pointer text-sm ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <p>{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div> */}

          <DropdownMenuSeparator />

          {/* Profile Button at Bottom */}
          <div className="mt-6">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                ChangeTab("profile");
                setOpen(false);
              }}
            >
              <User className="h-4 w-4 mr-2" />
              My Profile
            </Button>
          </div>

        </div>
      </SheetContent>
    </Sheet>

  );
}
