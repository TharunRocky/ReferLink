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

export default function MobileSidebar({ session, ChangeTab, tab }) {

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
            variant={tab === "home" ? "default" : "ghost"}
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
            variant={tab === "my-posts" ? "default" : "ghost"}
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
              variant={tab === "admin" ? "default" : "ghost"}
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
              variant={tab === "advancedControls" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                ChangeTab("advancedControls");
                setOpen(false);
              }}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Advanced 
            </Button>
          )}

          <DropdownMenuSeparator />

          {/* Post Actions */}
          <p className="font-semibold text-sm text-gray-500">Post Actions</p>

          <Button
            variant={tab === "postRequest" ? "default" : "ghost"}
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
            variant={tab === "postOpening" ? "default" : "ghost"}
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
            variant={tab === "generalChat" ? "default" : "ghost"}
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

          <DropdownMenuSeparator />

          {/* Profile Button at Bottom */}
          <div className="mt-6">
            <Button
              variant={tab === "profile" ? "default" : "ghost"}
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
