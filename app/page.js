'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Briefcase, Users, LogOut, Plus, Search, User } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/pages/Navbar';
import MyPostsPage from '@/pages/MyPostsPage';
import HomePage from '@/pages/HomePage';
import AdminDashboard from '@/pages/AdminDashboard';
import PostJobOpeningPage from '@/pages/PostJobOpeningPage';
import PostJobRequestPage from '@/pages/PostJobRequestPage';
import useJobRequests from '@/hooks/useJobRequests';
import useJobsOpenings from '@/hooks/useJobsOpenings';
import GeneralChat from '@/pages/GeneralChat';
import useChats from '@/hooks/useChats';
import FirestoreStorageDashboard from '@/pages/FirestoreDashboard';
import ProfileUpdateCard from '@/pages/ProfileUpdate';

export default function App() {
  const { data: session, status } = useSession();
  const router = useRouter();;
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentTab, setCurrentTab] = useState("home");
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } 
    else if(status === 'authenticated'){
      if(session.user.role === 'ADMIN'){
        fetchPendingUsers();
        fetchAnalytics();
      }
       fetchUser();
    }
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab) {
      setCurrentTab(tab);
    }
  }, [status]);
    
  const jobOpenings = useJobsOpenings();
  const jobRequests = useJobRequests();
  const messages = useChats();

    const fetchUser = async()=> {
      setLoading(true);
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setProfile(normalizeUserData(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    function normalizeUserData(user) {
    return {
      id: user.id || "",
      fullName: user.fullName || "",
      email: user.email || "",
      linkedinProfile: user.linkedinProfile || "",
      company: user.company || "",
      bio: user.bio || "",
      image: "/icons/logo.png",
    };
    }


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


  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Pending user view
  if (session.user.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-8 pt-8">
            <h1 className="text-3xl font-bold text-gray-900">ReferLink</h1>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          <Card className="max-w-2xl mx-auto mt-16">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl">Waiting for Admin Approval</CardTitle>
              <CardDescription className="text-base mt-2">
                Your join request is under review. You'll receive a notification once an admin approves your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  We review all applications to ensure a trusted community. This usually takes 24-48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar session={session} status={status} ChangeTab={setCurrentTab} />
      {currentTab === "my-posts" && (
        <MyPostsPage  session={session} jobRequests={jobRequests} jobOpenings={jobOpenings}/>
      )}
      {currentTab === "home" && (
        <HomePage session={session} jobRequests={jobRequests} jobOpenings={jobOpenings} />
      )}
      {currentTab === "admin" && (
        <AdminDashboard jobRequests={jobRequests} jobOpenings={jobOpenings} analytics={analytics} refreshAnalytics={fetchAnalytics} pendingUsers={pendingUsers} refreshPendingUsers={setPendingUsers} loading={loading}/>
      )}
      {currentTab === "firestore" && (
        <FirestoreStorageDashboard />
      )}
      {currentTab === "postOpening" && (
       <PostJobOpeningPage session={session} ChangeTab={setCurrentTab} />
      )}
      {currentTab === "postRequest" && (
        <PostJobRequestPage session={session} ChangeTab={setCurrentTab} />
      )}
      {currentTab === "generalChat" && (
        <GeneralChat session={session} messages={messages}/>
      )}
      {currentTab === "profile" && (
        <ProfileUpdateCard session={session} profile={profile} setProfile={setProfile}/>
      )}
    </div>
  );
}
