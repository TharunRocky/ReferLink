import { useState, useEffect } from 'react';

const useBeforeInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // e.preventDefault(); // Prevent the default prompt
      setDeferredPrompt(e); // Save the event for later use
      setShowInstallButton(true); // Show the install button
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice
        .then((choiceResult) => {
          console.log('User choice:', choiceResult.outcome);
          setDeferredPrompt(null); // Reset the prompt after user response
          setShowInstallButton(false); // Hide the install button
        })
        .catch((err) => {
          console.error('Install prompt error:', err);
          setDeferredPrompt(null);
        });
    }
  };

  return { showInstallButton, promptInstall };
};

export default useBeforeInstallPrompt;
