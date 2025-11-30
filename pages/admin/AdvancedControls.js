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
  const [selectedCompany, setSelectedCompany] = useState(null);



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

  const companyList = [...new Set(allUsers.map(u => u.company).filter(Boolean))];


if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto px-4 py-8">
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-gray-900 mb-2">Advanced Controls</h1>
    <p className="text-gray-600">Platform Usage Management</p>
  </div>

  <Tabs defaultValue="settings" className="w-full">
    <TabsList className="grid w-full grid-cols-2 mb-6">
      <TabsTrigger value="settings">Settings</TabsTrigger>
      <TabsTrigger value="company">Company</TabsTrigger>
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

    {/* COMPANY TAB */}
<TabsContent value="company">
  <Card>
    <CardHeader>
      <CardTitle>Companies</CardTitle>
      <CardDescription>
        View companies and the users working in them
      </CardDescription>
    </CardHeader>

    <CardContent>
      {/* List of Companies */}
      {!selectedCompany && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyList.length === 0 && (
            <p>No companies found.</p>
          )}

          {companyList.map((company) => (
            <Card
              key={company}
              className="p-4 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => setSelectedCompany(company)}
            >
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase size={18} /> {company}
              </CardTitle>
              <CardDescription>
                {
                  allUsers.filter((u) => u.company === company).length
                }{" "}
                Users
              </CardDescription>
            </Card>
          ))}
        </div>
      )}

      {/* Users in Selected Company */}
      {selectedCompany && (
        <div>
          <Button
            variant="secondary"
            className="mb-4"
            onClick={() => setSelectedCompany(null)}
          >
            ← Back to Companies
          </Button>

          <h2 className="text-xl font-semibold mb-3">
            Users in {selectedCompany}
          </h2>

          {allUsers
            .filter((u) => u.company === selectedCompany)
            .map((user) => (
              <Card key={user.id} className="p-4 mb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users size={18} /> {user.username}
                </CardTitle>
                <CardDescription>
                  Email: {user.email || "N/A"}
                </CardDescription>
              </Card>
            ))}
        </div>
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
