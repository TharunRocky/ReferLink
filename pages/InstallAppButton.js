import React, { useState, useEffect } from "react";

export default function InstallAppButton() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Detecting if the PWA can be installed
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent the default install prompt
      setDeferredPrompt(e); // Save the event for later use
      setIsInstallable(true); // Show the install button
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Clean up the event listener
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Handle the install process
  const handleInstallClick = async () => {
    if (!deferredPrompt) return; // Check if the deferred prompt is available

    deferredPrompt.prompt(); // Show the native install prompt

    // Wait for the user choice
    const choice = await deferredPrompt.userChoice;
    console.log("User choice:", choice.outcome);

    // Reset the prompt after installation
    setDeferredPrompt(null);
    setIsInstallable(false); // Hide the install button after installation
  };

  // Only render the button if the app can be installed
  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 z-50"
      style={{
        // width: "60px",           // Width and height must be the same for a perfect circle
        // height: "60px",          // Same as width  // Button background color (optional)
        borderRadius: "50%",     // Makes the button circular
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",            // Remove padding
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Optional shadow
        cursor: "pointer",      // Pointer cursor on hover
      }}
    >
      <img
        src="/icons/logo.png"  // Update with the correct path to your icon
        alt="Install App Icon"
        style={{
          width: "60px",            // Size of the image inside the button
          height: "60px",           // Make sure it fits in the button
          borderRadius: "50%",      // Trim the image to a round shape
          objectFit: "cover",       // Ensures the image covers the circle without stretching
        }} // Adjust size as needed
      />
    </button>
  );
}
