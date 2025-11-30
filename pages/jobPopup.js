import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, X } from "lucide-react";

const JobPopup = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40">
      {/* Popup Container */}
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 animate-fadeIn relative">
        
        {/* Close Icon */}
        <button
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Card layout matching your JobList */}
        <Card className="shadow-none border-0">
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription>{job.experienceLevel}</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600 mb-4">{job.description}</p>

            <div className="flex gap-5 text-sm text-slate-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {job.location}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" /> {job.userFullName}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {(job.skills || []).map((s, i) => (
                <Badge key={i} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
{/* 
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  // You can keep your existing handlers here
                  if (job.email) {
                    window.location.href = `/profile/${job.email}`;
                  }
                }}
              >
                View Profile
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobPopup;
