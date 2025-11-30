"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/HomeNavbar";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [issue, setIssue] = useState({ issueSubject: "", issueDesc: "" });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    company: "",
    bio: "",
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Logged in successfully");
        router.replace("/");
        router.refresh();
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  /** NAVBAR */

  /** SIGNUP */
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Join request submitted! Please login to see your status.");
        setSignupData({
          fullName: "",
          email: "",
          password: "",
          company: "",
          bio: "",
        });
      } else {
        toast.error(data.error || "Error submitting request");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  /** CONTACT ADMIN */
  const handleIssue = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/contactAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issue),
      });

      if (res.ok) {
        toast.success("Your issue has been sent to admin");
        setIssue({ issueSubject: "", issueDesc: "" });
      } else {
        toast.error("Failed to send issue");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* SEPARATOR */}
      <div className="border-b border-gray-200" />

      {/* PAGE WRAPPER */}
      <div className="w-full flex justify-center bg-white">
        <div className="w-full max-w-5xl px-6 py-24">

          {/* TITLE */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-center mb-14"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              Login to Your Account
            </h1>

            <p className="text-gray-600 text-lg mt-3 max-w-xl mx-auto">
              Access your private referral dashboard and continue exploring opportunities.
            </p>
          </motion.div>

          {/* CARD */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="flex justify-center"
          >
            <Card className="w-full max-w-xl shadow-xl border border-gray-200 rounded-2xl p-2 bg-white">
              <CardHeader>
                <CardTitle className="text-center text-xl font-semibold">
                  Continue to ReferLink
                </CardTitle>
              </CardHeader>

              <CardContent>

                {/* TABS */}
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl mb-7">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow rounded-lg py-2"
                    >
                      Login
                    </TabsTrigger>

                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow rounded-lg py-2"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  {/* LOGIN FORM */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="relative">
                        <Label>Email Address</Label>
                        <Mail className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
                        <Input
                          required
                          type="email"
                          className="pl-10"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData({ ...loginData, email: e.target.value })
                          }
                        />
                      </div>

                      <div className="relative">
                        <Label>Password</Label>
                        <Lock className="absolute left-3 top-10 w-4 h-4 text-gray-400" />
                        <Input
                          required
                          type="password"
                          className="pl-10"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({ ...loginData, password: e.target.value })
                          }
                        />
                      </div>

                      <Button className="w-full h-11 text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-xl shadow-md">
                        {isLoading ? "Signing in…" : "Sign In"}
                      </Button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setContactOpen(true)}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Need help?
                        </button>
                      </div>
                    </form>
                  </TabsContent>

                  {/* SIGNUP FORM */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-5">

                      <div>
                        <Label>Full Name</Label>
                        <Input
                          value={signupData.fullName}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              fullName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={signupData.email}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          minLength={8}
                          value={signupData.password}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Company</Label>
                        <Input
                          placeholder="e.g. Infosys, Virtusa"
                          value={signupData.company}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              company: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label>Short Bio</Label>
                        <Textarea
                          rows={3}
                          value={signupData.bio}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              bio: e.target.value,
                            })
                          }
                        />
                      </div>

                      <Button className="w-full h-11 text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-xl shadow-md">
                        {isLoading ? "Submitting…" : "Sign Up"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* CONTACT ADMIN DIALOG */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Contact Admin</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Issue Subject</Label>
              <Input
                placeholder="Enter subject"
                value={issue.issueSubject}
                onChange={(e) =>
                  setIssue({ ...issue, issueSubject: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Issue Description</Label>
              <Textarea
                rows={4}
                placeholder="Describe your issue"
                value={issue.issueDesc}
                onChange={(e) =>
                  setIssue({ ...issue, issueDesc: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
              onClick={() => {
                setContactOpen(false);
                handleIssue();
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
