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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdvancedControls() {



  return (
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
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Admin Settings</CardTitle>
            <CardDescription>Manage notifications and user configurations</CardDescription>
          </CardHeader>
          <CardContent>

            {/* --- NOTIFICATION DELETE BLOCK --- */}
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-2">Notifications Options</h3>
              <p className="text-sm text-gray-600 mb-4">
                Delete old notifications based on the number of days
              </p>

              <NotificationSettings />
            </div>

            {/* --- USER CONFIG BLOCK --- */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">User Config</h3>
              <p className="text-sm text-gray-600 mb-4">
                Update username or modify user status
              </p>

              <UserConfigSettings />
            </div>

          </CardContent>
        </Card>
      </TabsContent>

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
