'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Briefcase, Trash2, User } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MyPostsPage({ session ,  jobRequests, jobOpenings}) {
  if(!session) return null;
  const [loading, setLoading] = useState(false);

 const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const endpoint = type === "request" ? "job-requests" : "job-openings";
      await fetch(`/api/${endpoint}?job_id=${id}`, {
            method: 'DELETE'
        });
      toast.success(`${type === "request" ? "Job request" : "Job opening"} deleted successfully`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Posts</h1>
        <p className="text-gray-600">Manage your job requests and openings</p>
      </div>

      <Tabs defaultValue="openings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="requests" data-testid="my-requests-tab">
            My Job Requests ({(jobRequests?.filter(job => job.userFullName === session.user.name) ?? []).length})
          </TabsTrigger>
          <TabsTrigger value="openings" data-testid="my-openings-tab">
            My Job Openings ({(jobOpenings?.filter(job => job.userFullName === session.user.name) ?? [] ).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="openings">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : !jobOpenings ? (
            <div className="text-center py-12 text-gray-500">
              You haven't posted any job openings yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobOpenings.filter(job => job.userFullName === session.user.name).map((job) => (
                <Card key={job.id} data-testid={`my-opening-${job.id}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                        <CardDescription className="font-medium text-base">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Button
                        data-testid={`delete-my-opening-${job.id}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete("opening", job._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills && job.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : !jobRequests ? (
            <div className="text-center py-12 text-gray-500">
              You haven't posted any job requests yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobRequests.filter(job => job.userFullName === session.user.name).map((job) => (
                <Card key={job.id} data-testid={`my-request-${job.id}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                        <CardDescription>
                          Looking for: {job.experienceLevel}
                        </CardDescription>
                      </div>
                      <Button
                        data-testid={`delete-my-request-${job.id}`}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete("request", job._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills && job.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
