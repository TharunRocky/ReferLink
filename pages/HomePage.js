'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Briefcase, User, Trash2, Mail } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function HomePage({ session, jobRequests, jobOpenings, ChangeTab, ChangeProfile}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSearch = async () => {
    // if (!searchQuery.trim()) {
    //   fetchJobRequests();
    //   fetchJobOpenings();
    //   return;
    // }
    // refreshRequests();
    // fetchJobRequests();
    // fetchJobOpenings();
    // fetchJobRequestsFilter();
    // fetchJobOpeningsFilter();
    // setLoading(true);
    // try {
    //   const [requestsRes, openingsRes] = await Promise.all([
    //     fetch('/api/job-requests-search?search=${searchQuery}'),
    //     fetch('/api/job-openings-search?search=${searchQuery}'),
    //   ]);
    //   setJobRequests(requestsRes.data);
    //   setJobOpenings(openingsRes.data);
    // } catch (error) {
    //   toast.error("Search failed");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const endpoint = type === "request" ? "job-requests" : "job-openings";
      console.log("Started api call");
      await fetch(`/api/${endpoint}?job_id=${id}`, {
            method: 'DELETE'
        });
        console.log("finished api cal");
      toast.success(`${type === "request" ? "Job request" : "Job opening"} deleted successfully`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Delete failed");
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-600">Search through job requests and openings</p>
      </div>

      <div className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              data-testid="search-input"
              type="text"
              placeholder="Search by title, company, location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button data-testid="search-button" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="requests" data-testid="job-requests-tab">
            Job Requests ({!jobRequests ? 0 : jobRequests.length})
          </TabsTrigger>
          <TabsTrigger value="openings" data-testid="job-openings-tab">
            Job Openings ({!jobOpenings ? 0 : jobOpenings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="openings">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (!jobOpenings || jobOpenings.length === 0) ? (
            <div className="text-center py-12 text-gray-500">
              No job openings found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobOpenings.map((job) => (
                <Card key={job.id} data-testid={`job-opening-${job.id}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                        <CardDescription className="font-medium text-base">
                          {job.company}
                        </CardDescription>
                      </div>
                      {session.user.role === "ADMIN" && (
                        <Button
                          data-testid={`delete-opening-${job.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete("opening", job._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-2" />
                        Posted by: {job.userFullName}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        Mail: {job.email}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills && job.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                    <Button
                      variant="default"
                      onClick={() => {
                        ChangeTab("postProfile")
                        ChangeProfile(job.email)}}
                    >
                      View Profile
                    </Button>
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
          ) : (!jobRequests || jobRequests.length === 0) ? (
            <div className="text-center py-12 text-gray-500">
              No job requests found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobRequests.map((job) => (
                <Card key={job.id} data-testid={`job-request-${job.id}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                        <CardDescription>
                          Looking for: {job.experienceLevel}
                        </CardDescription>
                      </div>
                      {session.user.role === "ADMIN" && (
                        <Button
                          data-testid={`delete-request-${job.id}`}
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete("request", job._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-2" />
                        Posted by:{job.userFullName}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        Mail : {job.email}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {job.skills && job.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                    <Button
                      variant="default"
                      onClick={() => {
                        ChangeTab("postProfile")
                        ChangeProfile(job.email)}}
                      data-testid={`view-profile-${job.id}`}
                    >
                      View Profile
                    </Button>
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
