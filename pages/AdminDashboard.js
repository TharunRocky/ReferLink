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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard({jobRequests, jobOpenings}) {

  const [issues,setIssues]= useState([]);
  const [analytics, setAnalytics] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
      fetchPendingUsers();
      fetchAnalytics();
      fetchIssues();
  },[]);

   const handleApproveUser = async (userId) => {
      try {
        const res = await fetch('/api/admin/approve-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        if (res.ok) {
          toast.success('User approved successfully');
          fetchPendingUsers();
        }
      } catch (error) {
        toast.error('Error approving user');
      }
    };

      const handleRejectUser = async (userId) => {
        try {
          const res = await fetch('/api/admin/reject-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });
          if (res.ok) {
            toast.success('User rejected');
            fetchPendingUsers();
          }
        } catch (error) {
          toast.error('Error rejecting user');
        }
      };

      const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await fetch('api/admin/analytics');
        setAnalytics(await response.json());
        console.log("Loaded analytics");
      } catch (error) {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
  };

   const fetchIssues = async() => {
      setLoading(true);
      try{
        const res = await fetch('api/admin/issues');
        const data = await res.json();
        setIssues(data);
      }catch(error){
        console.log(error);
        toast.error('Failed to fetch issues');
      } finally {
        setLoading(false);
      }
    }

    const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pending-users');
      const data = await res.json();
      setPendingUsers(data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleDelete = async ( id) => {
    try {
      await fetch(`/api/admin/issues?issue_id=${id}`, {
            method: 'DELETE'
        });
      toast.success("issue deleted successfull");
      setIssues(issue => issue.filter(iss => iss.id!==id));
    } catch (error) {
      toast.error(error.response?.data?.detail || "Delete failed");
    }
  };

  function formatDate(dateString){
    const date=new Date(dateString);
    return date.toLocaleString("en-IN",{
      timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour: "numeric",
        hour12: true
    });
  }

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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform analytics and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card data-testid="analytics-users-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-users-count">
              {analytics?.totalUsers ?? 0}
            </div>
          </CardContent>
        </Card>

        {/* <Card data-testid="analytics-requests-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-requests-count">
              {analytics?.totalJobRequests ?? 0}
              </div>
          </CardContent>
        </Card> */}

        {/* <Card data-testid="analytics-openings-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Openings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="total-openings-count">
              {analytics?.totalJobOpenings ?? 0}
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Tabs defaultValue="pending-users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          {/* <TabsTrigger value="users" data-testid="admin-users-tab">Users</TabsTrigger> */}
          <TabsTrigger value="pending-users">Pending Users ({pendingUsers?.length ?? 0})</TabsTrigger>
           <TabsTrigger value="issues" data-testid="admin-requests-tab">Issues</TabsTrigger>
        </TabsList>
        <TabsContent value="pending-users">
                      <Card>
                        <CardHeader>
                          <CardTitle>Join Requests</CardTitle>
                          <CardDescription>Review and approve new user requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {!pendingUsers ? (
                            <p className="text-center text-gray-500 py-8">No pending requests</p>
                          ) : (
                            <div className="space-y-4">
                              {pendingUsers.map(user => (
                                <div key={user.id} className="border rounded-lg p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-semibold text-lg">{user.fullName}</h3>
                                      <p className="text-sm text-gray-600">{user.email}</p>
                                      <div className="mt-2">
                                        <Badge variant="secondary">{user.techStack}</Badge>
                                      </div>
                                      {user.linkedinProfile && (
                                        <a href={user.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                                          LinkedIn Profile
                                        </a>
                                      )}
                                      <p className="text-sm text-gray-700 mt-2">{user.bio}</p>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => handleApproveUser(user.id)}>
                                        Approve
                                      </Button>
                                      <Button size="sm" variant="destructive" onClick={() => handleRejectUser(user.id)}>
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
        </TabsContent>
        {/* ISSUES TAB */}
      <TabsContent value="issues">
        <Card>
          <CardHeader>
            <CardTitle>Issues Reported by Users</CardTitle>
            <CardDescription>Review reported issues</CardDescription>
            
            
          </CardHeader>

          <CardContent>
            {!issues || issues.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No issues reported</p>
            ) : (
              <div className="space-y-4">
                {issues.map(issue => (
                  <div
                    key={issue.id}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">
                      {issue.issueSubject}
                    </h3>

                    <p className="text-gray-700 mt-2 whitespace-pre-line">
                      {issue.issueDesc}
                    </p>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">

                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(issue.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  


                  
                ))}
              </div>
              
            )}
          </CardContent>
        </Card>
      </TabsContent>


      </Tabs>
    </div>
  );
}
