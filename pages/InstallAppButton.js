"use client";

import React, { useState, useEffect } from "react";

export default function InstallAppButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Detect install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  // Install handler
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Hide if not installable
  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="text-slate-700 hover:text-slate-900 transition font-medium"
    >
      Install App
    </button>
  );
}
