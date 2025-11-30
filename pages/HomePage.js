'use client';

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
  Search, MapPin, User, Mail, Filter, Trash2, ChevronDown, ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

/* -------------------------------------------------------
   Utility HR
------------------------------------------------------- */
const Hr = () => <div className="h-px bg-slate-200 my-4 w-full" />;

/* -------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------- */

export default function HomePage({ session, jobRequests = [], jobOpenings = [], ChangeTab, ChangeProfile }) {
  const [searchQuery, setSearchQuery] = useState("");

  /* ------------------------------------------
     FILTER STATES
  ------------------------------------------- */
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [sortBy, setSortBy] = useState("newest");

  /* ------------------------------------------
     MOBILE FILTER SIDE SHEET (Flipkart style)
  ------------------------------------------- */
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState("Role");

  /* ------------------------------------------
     DESKTOP FILTER PANEL (FULL WIDTH PANEL)
  ------------------------------------------- */
  const [showDesktopFilters, setShowDesktopFilters] = useState(false);
  const panelRef = useRef(null);

  // close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (showDesktopFilters && panelRef.current && !panelRef.current.contains(e.target)) {
        setShowDesktopFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDesktopFilters]);

  /* ------------------------------------------
     ACCORDIONS EXPANDED STATES
  ------------------------------------------- */
  const [expanded, setExpanded] = useState({
    role: true,
    experience: true,
    location: true,
    company: true,
    skills: true
  });

  /* ------------------------------------------
     DERIVED FILTER LISTS
  ------------------------------------------- */
  const allRoles = useMemo(() => {
    const setRoles = new Set();
    [...jobRequests, ...jobOpenings].forEach(j => j.title && setRoles.add(j.title));
    return [...setRoles];
  }, [jobRequests, jobOpenings]);

  const allExperiences = ["Fresher", "Junior", "Mid", "Senior"];

  const allLocations = useMemo(() => {
    const setLoc = new Set();
    [...jobRequests, ...jobOpenings].forEach(j => j.location && setLoc.add(j.location));
    return [...setLoc];
  }, [jobRequests, jobOpenings]);

  const allCompanies = useMemo(() => {
    const setComp = new Set();
    [...jobRequests, ...jobOpenings].forEach(j => j.company && setComp.add(j.company));
    return [...setComp];
  }, [jobRequests, jobOpenings]);

  const allSkills = useMemo(() => {
    const setS = new Set();
    [...jobRequests, ...jobOpenings].forEach(j => (j.skills || []).forEach(s => s && setS.add(s)));
    return [...setS];
  }, [jobRequests, jobOpenings]);

  /* ------------------------------------------
     TOGGLE HELPERS
  ------------------------------------------- */
  const toggleArray = (arr, setArr, value) => {
    if (!value) return;
    setArr(prev => prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]);
  };

  const clearFilters = () => {
    setSelectedRoles([]);
    setSelectedExperiences([]);
    setSelectedLocations([]);
    setSelectedCompanies([]);
    setSelectedSkills([]);
    setSkillInput("");
    setSortBy("newest");
  };

  /* ------------------------------------------
     ADD SKILL
  ------------------------------------------- */
  const addSkillFromInput = () => {
    const val = skillInput.trim();
    if (!val) return;
    if (!selectedSkills.includes(val)) {
      setSelectedSkills(prev => [...prev, val]);
    }
    setSkillInput("");
  };

  /* ------------------------------------------
     SEARCH + FILTER LOGIC
  ------------------------------------------- */
  const matchesMulti = (field, selected) => {
    if (!selected.length) return true;
    if (!field) return false;
    const f = String(field).toLowerCase();
    return selected.some(s => f.includes(String(s).toLowerCase()));
  };

  const applyFilters = (items) => {
    if (!items?.length) return [];

    const q = searchQuery.trim().toLowerCase();

    let list = items.filter(j => {
      const text = `${j.title} ${j.company} ${j.description} ${j.location} ${(j.skills || []).join(" ")}`.toLowerCase();

      if (q && !text.includes(q)) return false;
      if (!matchesMulti(j.title, selectedRoles)) return false;
      if (!matchesMulti(j.experienceLevel, selectedExperiences)) return false;
      if (!matchesMulti(j.location, selectedLocations)) return false;
      if (!matchesMulti(j.company, selectedCompanies)) return false;

      if (selectedSkills.length > 0) {
        const jobSkills = (j.skills || []).map(x => x.toLowerCase());
        const ok = selectedSkills.every(s => jobSkills.includes(s.toLowerCase()));
        if (!ok) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "title_az") {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  };

  const filteredRequests = applyFilters(jobRequests);
  const filteredOpenings = applyFilters(jobOpenings);

  /* ------------------------------------------
     DELETE HANDLER
  ------------------------------------------- */
  const handleDelete = async (type, id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await fetch(`/api/${type === "request" ? "job-requests" : "job-openings"}?job_id=${id}`, { method: "DELETE" });
      toast.success("Deleted");
    } catch {
      toast.error("Error deleting");
    }
  };

  /* -------------------------------------------------------
     START OF UI
  ------------------------------------------------------- */

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ------------------ HEADER ------------------ */}
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Find Your Next Opportunity</h1>
      <p className="text-slate-600 mb-6">Search through job requests and openings</p>

      {/* ------------------ SEARCH + SORT + FILTER BTN ------------------ */}
      <div className="flex gap-3 mb-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search by title, company, location…"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* SORT (Desktop only) */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-slate-600">Sort</span>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title_az">Title A → Z</option>
          </select>
        </div>

        {/* Desktop Filters Toggle */}
        <Button
          variant="outline"
          className="hidden md:flex gap-2"
          onClick={() => setShowDesktopFilters(v => !v)}
        >
          <Filter className="h-4 w-4" /> Filters
        </Button>

        {/* Mobile Filters Trigger */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button className="md:hidden">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          {/* ---------------- MOBILE FILTERS CONTENT ---------------- */}
          <MobileFilterContent
            allRoles={allRoles}
            allExperiences={allExperiences}
            allLocations={allLocations}
            allCompanies={allCompanies}
            allSkills={allSkills}
            selectedRoles={selectedRoles}
            selectedExperiences={selectedExperiences}
            selectedLocations={selectedLocations}
            selectedCompanies={selectedCompanies}
            selectedSkills={selectedSkills}
            setSelectedRoles={setSelectedRoles}
            setSelectedExperiences={setSelectedExperiences}
            setSelectedLocations={setSelectedLocations}
            setSelectedCompanies={setSelectedCompanies}
            setSelectedSkills={setSelectedSkills}
            sortBy={sortBy}
            setSortBy={setSortBy}
            mobileSection={mobileSection}
            setMobileSection={setMobileSection}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSkillFromInput={addSkillFromInput}
            clearFilters={clearFilters}
          />
        </Sheet>
      </div>
      {/* ---------------- DESKTOP FILTER PANEL (FULL WIDTH) ---------------- */}
      {showDesktopFilters && (
        <div
          ref={panelRef}
          className="hidden md:block bg-white border shadow-lg rounded-xl p-6 mb-6 animate-in fade-in slide-in-from-top-5"
        >
          {/* --- Roles / Experience / Location / Company Grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* ROLE */}
            <DesktopFilterGroup
              title="Role"
              expanded={expanded.role}
              onToggle={() =>
                setExpanded(prev => ({ ...prev, role: !prev.role }))
              }
              list={allRoles}
              selected={selectedRoles}
              toggle={(r) => toggleArray(selectedRoles, setSelectedRoles, r)}
            />

            {/* EXPERIENCE */}
            <DesktopFilterGroup
              title="Experience"
              expanded={expanded.experience}
              onToggle={() =>
                setExpanded(prev => ({ ...prev, experience: !prev.experience }))
              }
              list={allExperiences}
              selected={selectedExperiences}
              toggle={(r) =>
                toggleArray(selectedExperiences, setSelectedExperiences, r)
              }
            />

            {/* LOCATION */}
            <DesktopFilterGroup
              title="Location"
              expanded={expanded.location}
              onToggle={() =>
                setExpanded(prev => ({ ...prev, location: !prev.location }))
              }
              list={allLocations}
              selected={selectedLocations}
              toggle={(r) =>
                toggleArray(selectedLocations, setSelectedLocations, r)
              }
            />

            {/* COMPANY */}
            <DesktopFilterGroup
              title="Company"
              expanded={expanded.company}
              onToggle={() =>
                setExpanded(prev => ({ ...prev, company: !prev.company }))
              }
              list={allCompanies}
              selected={selectedCompanies}
              toggle={(r) =>
                toggleArray(selectedCompanies, setSelectedCompanies, r)
              }
            />
          </div>

          <Hr />

          {/* --------------------- SKILLS SECTION --------------------- */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Add skill (press Enter)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillFromInput();
                    }
                  }}
                />
                <Button onClick={addSkillFromInput}>Add</Button>
              </div>

              {/* Selected skill chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSkills.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-sm rounded-full"
                  >
                    {skill}
                    <button
                      className="text-slate-500"
                      onClick={() =>
                        setSelectedSkills(prev => prev.filter(s => s !== skill))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 self-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
              <Button onClick={() => setShowDesktopFilters(false)}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- JOB LIST TABS -------------------- */}
      <Tabs defaultValue="requests" className="mt-4">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="requests">
            Job Requests ({filteredRequests.length})
          </TabsTrigger>
          <TabsTrigger value="openings">
            Job Openings ({filteredOpenings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <JobList
            items={filteredRequests}
            session={session}
            handleDelete={handleDelete}
            ChangeTab={ChangeTab}
            ChangeProfile={ChangeProfile}
            type="request"
          />
        </TabsContent>

        <TabsContent value="openings">
          <JobList
            items={filteredOpenings}
            session={session}
            handleDelete={handleDelete}
            ChangeTab={ChangeTab}
            ChangeProfile={ChangeProfile}
            type="opening"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* -------------------------------------------------------
   Desktop Filter Group
------------------------------------------------------- */
function DesktopFilterGroup({ title, expanded, onToggle, list, selected, toggle }) {
  return (
    <div className="border rounded-md p-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{title}</h4>
        <button className="text-slate-500" onClick={onToggle}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 max-h-40 overflow-auto flex flex-col gap-2 pr-1">
          {list.map((item, i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => toggle(item)}
              />
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   MOBILE FILTER CONTENT (Flipkart style)
------------------------------------------------------- */
function MobileFilterContent({
  allRoles,
  allExperiences,
  allLocations,
  allCompanies,
  allSkills,
  selectedRoles,
  selectedExperiences,
  selectedLocations,
  selectedCompanies,
  selectedSkills,
  setSelectedRoles,
  setSelectedExperiences,
  setSelectedLocations,
  setSelectedCompanies,
  setSelectedSkills,
  sortBy,
  setSortBy,
  mobileSection,
  setMobileSection,
  skillInput,
  setSkillInput,
  addSkillFromInput,
  clearFilters,
}) {
  const sidebarItems = [
    "Sort",
    "Role",
    "Experience",
    "Location",
    "Company",
    "Skills"
  ];

  const sectionList = {
    Role: allRoles,
    Experience: allExperiences,
    Location: allLocations,
    Company: allCompanies,
  };

  const getSelected = {
    Role: selectedRoles,
    Experience: selectedExperiences,
    Location: selectedLocations,
    Company: selectedCompanies,
  };

  const setSelected = {
    Role: setSelectedRoles,
    Experience: setSelectedExperiences,
    Location: setSelectedLocations,
    Company: setSelectedCompanies,
  };

  return (
    <SheetContent side="right" className="p-0 w-[90vw] sm:w-[400px]">
      <SheetHeader className="px-4 py-3 border-b">
        <SheetTitle>Filters</SheetTitle>
      </SheetHeader>

      <div className="flex h-[calc(100vh-60px)] overflow-hidden">

        {/* LEFT PANEL (Sidebar) */}
        <div className="w-40 bg-slate-50 border-r overflow-auto">
          {sidebarItems.map((item, i) => (
            <div
              key={i}
              onClick={() => setMobileSection(item)}
              className={`px-4 py-3 cursor-pointer text-sm border-b ${
                mobileSection === item ? "bg-white font-semibold" : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-4 overflow-auto">

          {/* Sort */}
          {mobileSection === "Sort" && (
            <div>
              <select
                className="border rounded-md px-3 py-2 w-full"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title_az">Title A → Z</option>
              </select>
            </div>
          )}

          {/* Role/Experience/Location/Company */}
          {sectionList[mobileSection] && (
            <div className="flex flex-col gap-3">
              {sectionList[mobileSection].map((item, i) => (
                <label key={i} className="flex gap-2 text-sm items-center">
                  <input
                    type="checkbox"
                    checked={getSelected[mobileSection].includes(item)}
                    onChange={() =>
                      setSelected[mobileSection](prev =>
                        prev.includes(item)
                          ? prev.filter(x => x !== item)
                          : [...prev, item]
                      )
                    }
                  />
                  {item}
                </label>
              ))}
            </div>
          )}

          {/* Skills */}
          {mobileSection === "Skills" && (
            <div>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Add skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkillFromInput();
                    }
                  }}
                />
                <Button onClick={addSkillFromInput}>Add</Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSkills.map((s, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 bg-slate-200 rounded-full text-sm flex gap-2"
                  >
                    {s}
                    <button
                      onClick={() =>
                        setSelectedSkills(prev => prev.filter(x => x !== s))
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-auto">
                {allSkills.map((s, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      !selectedSkills.includes(s) &&
                      setSelectedSkills(prev => [...prev, s])
                    }
                    className="text-left bg-slate-100 p-2 rounded text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear / Apply Buttons */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              className="flex-1"
              onClick={() => document.querySelector("[data-state=open]")?.click()}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  );
}

/* -------------------------------------------------------
   JOB LIST
------------------------------------------------------- */
function JobList({ items, session, handleDelete, ChangeTab, ChangeProfile, type }) {
  if (!items.length)
    return <div className="text-center py-12 text-gray-500">No results found</div>;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map(job => (
        <Card key={job._id} className="hover:shadow-md transition">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>{job.experienceLevel}</CardDescription>
              </div>

              {session?.user?.role === "ADMIN" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(type, job._id)}
                >
                  <Trash2 className="text-red-500" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-slate-700 mb-3">{job.description}</p>

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

            <Button
              className="w-full"
              onClick={() => {
                ChangeTab("postProfile");
                ChangeProfile(job.email);
              }}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
