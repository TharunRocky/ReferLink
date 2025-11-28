'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, Briefcase, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import UserConfigSettings from "@/pages/admin/UserConfigSettings";
import NotificationSettings from "@/pages/admin/NotificationSettings";
import FirestoreStorageDashboard from '@/pages/FirestoreDashboard';
import ChatSettings from '@/pages/admin/ChatSettings';
import TemporaryPasswordGenerator from "./GeneratePassword";
import SendNotifications from "./SendNotification";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdvancedControls() {
  const [allUsers, setAllUsers] = useState([]);
  const [allUsers1, setAllUsers1] = useState([]);
  const [updated,setUpdated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("notifications");


  useEffect(() => {
    
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setAllUsers(data);  
        setAllUsers1(data);  
      } catch (error) {
        console.log(error);
        toast.error("Failed to load usernames");
      }finally{
        setLoading(false);
      }
    }

        fetchUsers();
  }, [updated]);

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (
    // <div className="max-w-7xl mx-auto px-4 py-8">
    //   <div className="mb-8">
    //     <h1 className="text-4xl font-bold text-gray-900 mb-2">Advanced Controls</h1>
    //     <p className="text-gray-600">Platform Usage Management</p>
    //   </div>


    //   <Tabs defaultValue="settings" className="w-full">
    //     <TabsList className="grid w-full grid-cols-2 mb-6">
    //         <TabsTrigger value="settings">Settings</TabsTrigger>
    //         <TabsTrigger value="firestore">Usage</TabsTrigger>
    //     </TabsList>
    //   <TabsContent value="settings">
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Admin Settings</CardTitle>
    //         <CardDescription>Manage notifications and user configurations</CardDescription>
    //       </CardHeader>
    //       <CardContent>

    //         {/* --- NOTIFICATION DELETE BLOCK --- */}
    //           <NotificationSettings />

    //         {/* --- USER CONFIG BLOCK --- */}
    //           <UserConfigSettings allUsers={allUsers} setUpdated={setUpdated}/>

    //         {/* --- DELETE CHAT BLOCK --- */}
    //           <ChatSettings/>

    //         {/* --- Generate Temporary Password --- */}
    //         <TemporaryPasswordGenerator users={allUsers1}/>

    //       </CardContent>
    //     </Card>
    //   </TabsContent>

    //   <TabsContent value="firestore">
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Analytics</CardTitle>
    //         <CardDescription>Storage and Network Usage</CardDescription>
    //       </CardHeader>
    //       <CardContent>

    //         <FirestoreStorageDashboard />
    //       </CardContent>
    //     </Card>
    //   </TabsContent>


    //   </Tabs>
    // </div>
    <div className="max-w-7xl mx-auto px-4 py-8">
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-gray-900 mb-2">Advanced Controls</h1>
    <p className="text-gray-600">Platform Usage Management</p>
  </div>

  <Tabs defaultValue="settings" className="w-full">
    <TabsList className="grid w-full grid-cols-2 mb-6">
      <TabsTrigger value="settings">Settings</TabsTrigger>
      <TabsTrigger value="firestore">Usage</TabsTrigger>
    </TabsList>

    {/* SETTINGS TAB */}
    <TabsContent value="settings">
      <Card>
        <CardHeader>
          <CardTitle>Admin Settings</CardTitle>
          <CardDescription>
            Manage notifications and user configurations
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* ------------------------- */}
          {/* DROPDOWN SELECTOR         */}
          {/* ------------------------- */}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Setting
            </label>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="notifications">Notifications</option>
              <option value="userConfig">User Config</option>
              <option value="deleteChats">Delete Chats</option>
              <option value="tempPassword">Temporary Password</option>
              <option value="sendNotification">Send Notifications</option>
            </select>
          </div>

          {/* ------------------------- */}
          {/* CONDITIONAL RENDER BLOCKS */}
          {/* ------------------------- */}

          {selectedSection === "notifications" && (
            <NotificationSettings />
          )}

          {selectedSection === "userConfig" && (
            <UserConfigSettings
              allUsers={allUsers}
              setUpdated={setUpdated}
            />
          )}

          {selectedSection === "deleteChats" && <ChatSettings />}

          {selectedSection === "tempPassword" && (
            <TemporaryPasswordGenerator users={allUsers1} />
          )}

          {selectedSection === "sendNotification" && (
            <SendNotifications />
          )}
        </CardContent>
      </Card>
    </TabsContent>

    {/* FIRESTORE TAB */}
    <TabsContent value="firestore">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Storage and Network Usage</CardDescription>
        </CardHeader>
        <CardContent>
          <FirestoreStorageDashboard />
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>

  );
}
