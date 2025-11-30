"use client";

import { motion } from "framer-motion";
import AnimatedVideoFrame from "./AnimatedVideoFrame";
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/HomeNavbar";

/* ------------------------
   Animation Variants
------------------------ */
const container = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};


/* ------------------------
   Main Page Component
------------------------ */
export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">

      {/* ⬅️ New Navbar */}
      <Navbar />

      {/* Hero */}
      <header className="relative overflow-hidden pt-32">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/30 via-transparent to-transparent opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 drop-shadow-sm">
              How Referlink Works
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              A private referral community where job seekers post requests and professionals refer them internally — fast, private, effective.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <a
                href="/login"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 px-6 py-3 text-white font-semibold shadow-lg hover:brightness-105 transition"
              >
                Get Started
              </a>
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-800">
                Learn how it works →
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 -mt-4 pb-24">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="space-y-28">

          <FeatureStripe
            num="01"
            title="Are you looking for a job?"
            description="Create a clean and compelling job request highlighting your experience, skills, and preferred roles. Your request becomes discoverable to verified professionals who can refer you internally."
            video="/Feature1.mp4"
            reverse={false}
          />

          <FeatureStripe
            num="02"
            title="Are you a working professional? Looking for passive income?"
            description="Browse job requests posted by candidates, filter by skills or experience, and submit internal referrals effortlessly. Earn passive rewards while helping talent find opportunities."
            video="/Feature2.mp4"
            reverse={true}
          />

          <FeatureStripe
            num="03"
            title="Smart Notifications"
            description="Stay updated with personalized notifications — whether you're watching job seekers, job openings, or new community activity. Never miss an opportunity relevant to you."
            video="/Feature3.mp4"
            reverse={false}
          />

          <FeatureStripe
            num="04"
            title="Community Chat & Collaboration"
            description="Join a private community space where candidates and professionals discuss roles, share insights, and support each other — all in a safe, respectful environment."
            video="/Feature4.mp4"
            reverse={true}
          />

        </motion.div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-gradient-to-r from-indigo-50/40 to-teal-50/40 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Ready to get referred?</h3>
            <p className="mt-2 text-slate-600">Post a request and let professionals help you land your next role.</p>
          </div>
          <div>
            <a className="inline-flex items-center gap-3 rounded-full bg-slate-900 text-white px-5 py-3 font-semibold shadow hover:brightness-105 transition" href="/login">
              Create Request
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}

/* ------------------------
   FeatureStripe Component
------------------------ */
function FeatureStripe({ num, title, description, video, reverse = false }) {
  return (
    <motion.section
      variants={fadeUp}
      className={`grid gap-10 items-center lg:grid-cols-2 max-w-6xl mx-auto`}
    >
      {/* Left / Text */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className={`px-2 ${reverse ? "lg:order-2" : "lg:order-1"}`}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-semibold shadow">
            {num}
          </div>
          <div className="flex-1 border-b border-slate-100" />
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{title}</h3>
        <p className="mt-4 text-slate-600 max-w-xl">{description}</p>

        <ul className="mt-8 space-y-3 text-slate-700">
          {["Smooth, private posting flow", "Fast discovery & referrals", "Custom notifications & chat"].map((t, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
              <span>{t}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Right / Video */}
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7 }}
        className={`px-2 ${reverse ? "lg:order-1" : "lg:order-2"}`}
      >
        <div className="relative">
          <div className="absolute -top-6 right-6 z-10">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium shadow ring-1 ring-white/60">
              <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
              </svg>
              Live preview
            </div>
          </div>

          <div className="rounded-3xl p-2 bg-gradient-to-r from-indigo-500/30 to-teal-400/30">
            <div className="rounded-2xl overflow-hidden bg-black/80 border border-white/10 shadow-2xl">
              <AnimatedVideoFrame src={video} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
