'use client';

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";
import { sendTopicNotification } from "@/lib/sendTopicMessages";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function PostJobOpeningPage({session, ChangeTab}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    title: "",
    description: "",
    skills: [],
    location: "",
    jobType: "",
    username:""
  });
  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.skills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    if (!formData.jobType) {
      toast.error("Please select a job type");
      return;
    }

    setIsLoading(true);
    try {
    await fetch('/api/job-openings',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
      toast.success("Job opening posted successfully!");

      //Notify all subscribed users
      await sendTopicNotification({
        topic: "jobOpenings",
        title: "New Job Posted!",
        content: `${formData.title} is now available`,
      });

      ChangeTab("home");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to post job opening");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card data-testid="post-job-opening-card">
        <CardHeader>
          <CardTitle className="text-3xl">Post a Job Opening</CardTitle>
          <CardDescription>Share your job opportunity with talented candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                data-testid="job-opening-company-input"
                placeholder="e.g. Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                data-testid="job-opening-title-input"
                placeholder="e.g. Senior Backend Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                data-testid="job-opening-description-input"
                placeholder="Describe the role, responsibilities, requirements..."
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  data-testid="job-opening-skills-input"
                  placeholder="Add a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                />
                <Button
                  data-testid="add-skill-button"
                  type="button"
                  onClick={handleAddSkill}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-green-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                data-testid="job-opening-location-input"
                placeholder="e.g. San Francisco, CA or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select
                value={formData.jobType}
                onValueChange={(value) => setFormData({ ...formData, jobType: value })}
              >
                <SelectTrigger id="jobType" data-testid="job-opening-type-select">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent data-testid="job-type-options">
                  <SelectItem value="Full-time" data-testid="job-type-fulltime">Full-time</SelectItem>
                  <SelectItem value="Part-time" data-testid="job-type-parttime">Part-time</SelectItem>
                  <SelectItem value="Contract" data-testid="job-type-contract">Contract</SelectItem>
                  <SelectItem value="Freelance" data-testid="job-type-freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button
                data-testid="submit-job-opening-button"
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Post Job Opening"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                        ChangeTab("home")
                    }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
