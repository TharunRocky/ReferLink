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


export default function PostJobRequestPage({session, ChangeTab}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    location: "",
    experienceLevel: "",
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

    if (!formData.experienceLevel) {
      toast.error("Please select an experience level");
      return;
    }

    setIsLoading(true);
    try {
    const res = await fetch('/api/job-requests',{
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify(formData),
    })
      toast.success("Job request posted successfully!",res);
      ChangeTab("home");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to post job request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card data-testid="post-job-request-card">
        <CardHeader>
          <CardTitle className="text-3xl">Post a Job Request</CardTitle>
          <CardDescription>
            Let employers know you're looking for opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title / Position</Label>
              <Input
                id="title"
                data-testid="job-request-title-input"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                data-testid="job-request-description-input"
                placeholder="Describe your background, what you're looking for..."
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  data-testid="job-request-skills-input"
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
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-blue-900"
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
                data-testid="job-request-location-input"
                placeholder="e.g. New York, NY or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) =>
                  setFormData({ ...formData, experienceLevel: value })
                }
              >
                <SelectTrigger id="experienceLevel" data-testid="job-request-experience-select">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent data-testid="experience-level-options">
                  <SelectItem value="Entry Level" data-testid="experience-entry">Entry Level</SelectItem>
                  <SelectItem value="Mid Level" data-testid="experience-mid">Mid Level</SelectItem>
                  <SelectItem value="Senior Level" data-testid="experience-senior">Senior Level</SelectItem>
                  <SelectItem value="Lead/Principal" data-testid="experience-lead">Lead/Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button
                data-testid="submit-job-request-button"
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? "Posting..." : "Post Job Request"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => ChangeTab("home")}
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
