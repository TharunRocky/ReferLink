"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 w-full z-50 backdrop-blur-xl transition-all ${
          scrolled
            ? "bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            : "bg-white/20 border-b border-white/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <a
            href="/"
            className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500"
          >
            ReferLink
          </a>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/" className="text-slate-700 hover:text-slate-900 transition">
              Home
            </a>
            <a
              href="/howItWorks"
              className="text-slate-700 hover:text-slate-900 transition"
            >
              How it Works
            </a>
            <a
              href="/login"
              className="rounded-full px-5 py-2 bg-slate-900 text-white shadow hover:brightness-110 transition"
            >
              Login
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg z-40"
          >
            <div className="flex flex-col px-6 py-4 text-base font-medium gap-4">
              <a
                href="/"
                onClick={() => setOpen(false)}
                className="text-slate-700 hover:text-slate-900 transition"
              >
                Home
              </a>
              <a
                href="/howItWorks"
                onClick={() => setOpen(false)}
                className="text-slate-700 hover:text-slate-900 transition"
              >
                How it Works
              </a>
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-full px-5 py-2 bg-slate-900 text-white shadow hover:brightness-110 transition w-fit"
              >
                Login
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
