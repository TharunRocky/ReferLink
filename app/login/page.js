'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Lock, Twitter, Github, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import InstallAppButton from '@/pages/InstallAppButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


export default function LoginPage() {

  // const session = await getServerSession(authOptions);

  //   if (session) {
  //     redirect('/');
  //   }

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [issueSubject, setIssueSubject] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    company: '',
    bio: '',
  });
  const [issue,setIssue]= useState({
    issueSubject: '',
    issueDesc: '',
  });


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Logged in successfully');
        router.replace('/');
        router.refresh();
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Join request submitted! Please login to see your status.');
        setSignupData({ fullName: '', email: '', password: '', company: '', bio: '' });
      } else {
        toast.error(data.error || 'Error submitting request');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssue = async (e) => {
    setIsLoading(true);
    try{
      const res = await fetch('/api/contactAdmin',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(issue),
      });
      const data= await res.json();
      if(res.ok){
       toast.success("Your issue has been sent to admin");
       setIssue({issueSubject:'', issueDesc:''});
      } else {
        toast.error('Failed to send issue');
      }
    } catch {
      toast.error('An error occurred');
    } finally{
      setIsLoading(false);
    }
  };

  /* Accent color for button: orange like the example */
  const btnAccent = 'bg-orange-500 hover:bg-orange-600 text-white';

  return (
   <><div className="min-h-screen bg-indigo-50 flex items-center justify-center">

      {/* DESKTOP (2-column layout) */}
      <div className="hidden md:grid w-full max-w-6xl grid-cols-2 gap-10 px-10 py-16">

        {/* LEFT SIDE – Welcome */}
        <div className="flex flex-col justify-center h-full sticky top-0">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome Back
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Sign in and continue exploring opportunities tailored for you.
          </p>

          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 flex items-center justify-center">
              <Twitter className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 flex items-center justify-center">
              <Facebook className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 flex items-center justify-center">
              <Github className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE – Login Card */}
        <div className="w-full">
          <Card className="bg-white shadow-md rounded-2xl">
            <CardHeader className="px-8 pt-8">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Access your account
              </CardTitle>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* LOGIN DESKTOP */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                      <Label>Email Address</Label>
                      <Mail className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
                      <Input
                        type="email"
                        required
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                    </div>

                    <div className="relative">
                      <Label>Password</Label>
                      <Lock className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
                      <Input
                        type="password"
                        required
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                    </div>

                    {/* <div className="flex items-center justify-between text-sm text-gray-700">
                      <label className="flex items-center gap-2"> */}
                        {/* <input
      type="checkbox"
      checked={loginData.remember}
      onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
      className="h-4 w-4"
    />
    Remember me */}
                      {/* </label>
                      <a href="#" className="text-orange-600 hover:underline">Forgot password?</a>
                    </div> */}

                    <Button className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-md">
                      {isLoading ? "Signing in…" : "Sign in now"}
                    </Button>
                    <div className="text-center mt-3">
                    <button
                      type="button"
                      onClick={() => setContactOpen(true)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Contact Admin
                    </button>
                  </div>

                  </form>
                </TabsContent>

                {/* SIGNUP DESKTOP */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                      <Label>Full name</Label>
                      <Input
                        value={signupData.fullName}
                        onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })} />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
                    </div>

                    <div>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        minLength={8}
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                    </div>

                    <div>
                      <Label>Company</Label>
                      <Input
                        placeholder="e.g., Infosys, Virtusa"
                        value={signupData.company}
                        onChange={(e) => setSignupData({ ...signupData, company: e.target.value })} />
                    </div>

                    <div>
                      <Label>Short bio (optional)</Label>
                      <Textarea
                        rows={3}
                        value={signupData.bio}
                        onChange={(e) => setSignupData({ ...signupData, bio: e.target.value })} />
                    </div>

                    <Button className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-md">
                      {isLoading ? "Submitting…" : "Sign up"}
                    </Button>
                    <div className="text-center mt-3">
                      <button
                        type="button"
                        onClick={() => setContactOpen(true)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Contact Admin
                      </button>
                    </div>

                  </form>
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MOBILE VERSION — FIXED, NO SCROLL */}
      <div className="md:hidden fixed inset-0 overflow-hidden bg-indigo-50 flex">
        <div className="flex-1 overflow-y-auto flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-md">

            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-sm text-gray-600">Sign in to continue to ReferLink</p>
            </div>

            <Card className="shadow-md rounded-xl">
              <CardContent className="p-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg mb-4">
                    <TabsTrigger value="login" className="data-[state=active]:bg-white rounded-md">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-white rounded-md">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {/* MOBILE LOGIN */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="relative">
                        <Label>Email</Label>
                        <Mail className="absolute left-3 top-10 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          required
                          className="pl-10"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                      </div>

                      <div className="relative">
                        <Label>Password</Label>
                        <Lock className="absolute left-3 top-10 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          required
                          className="pl-10"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                      </div>

                      {/* <div className="flex items-center justify-between text-sm text-gray-700">
                        <label className="flex items-center gap-2"> */}
                          {/* <input
      type="checkbox"
      checked={loginData.remember}
      onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
      className="h-4 w-4"
    />
    Remember me */}
                        {/* </label>
                        <a className="text-orange-600 hover:underline" href="#">Forgot?</a>
                      </div> */}

                      <Button className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-md">
                        {isLoading ? "Signing in…" : "Sign in"}
                      </Button>
                      <div className="text-center mt-3">
                      <button
                        type="button"
                        onClick={() => setContactOpen(true)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Contact Admin
                      </button>
                    </div>

                    </form>
                  </TabsContent>

                  {/* MOBILE SIGNUP */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div>
                        <Label>Full name</Label>
                        <Input
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })} />
                      </div>

                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
                      </div>

                      <div>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          minLength={8}
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                      </div>

                      <div>
                        <Label>Company</Label>
                        <Input
                          placeholder="e.g., Infosys, Virtusa"
                          value={signupData.company}
                          onChange={(e) => setSignupData({ ...signupData, company: e.target.value })} />
                      </div>

                      <div>
                        <Label>Short bio (optional)</Label>
                        <Textarea
                          rows={3}
                          value={signupData.bio}
                          onChange={(e) => setSignupData({ ...signupData, bio: e.target.value })} />
                      </div>

                      <Button className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white rounded-md">
                        {isLoading ? "Submitting…" : "Sign Up"}
                      </Button>
                      <div className="text-center mt-3">
                        <button
                          type="button"
                          onClick={() => setContactOpen(true)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Contact Admin
                        </button>
                      </div>

                    </form>
                  </TabsContent>

                </Tabs>
              </CardContent>
            </Card>
            <InstallAppButton />
          </div>
        </div>
      </div>
    </div>
    <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Admin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Issue Subject</Label>
              <Input
                placeholder="Enter subject"
                value={issue.issueSubject}
                onChange={(e) => setIssue({...issue, issueSubject:e.target.value})} />
            </div>

            <div>
              <Label>Issue Description</Label>
              <Textarea
                rows={4}
                placeholder="Describe your issue"
                value={issue.issueDesc}
                onChange={(e) => setIssue({...issue,issueDesc:e.target.value})} />
            </div>
          </div>

          <DialogFooter>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                toast.success("Your issue has been sent to admin");
                setContactOpen(false);
                handleIssue();
              } }
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog></>



  );
}
