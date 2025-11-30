// Required for receiving background notifications
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCNIwIQA4IRxyGI-d_93GV6qKR8Bfp-gZ4",
  authDomain: "jobsearch-b49dd.firebaseapp.com",
  projectId: "jobsearch-b49dd",
  messagingSenderId: "1041147721962",
  appId: "1:1041147721962:web:5ad5113a95eb8ee617bf93"
});

const messaging = firebase.messaging();


self.addEventListener("push", function (event) {
  const payload = event.data?.json() || {};
  const data = payload.data || {};

  const options = {
    body: data.body || "",
    icon: "/icons/icon-512x512.png",           //  app icon
    badge: "/icons/favicon-32x32.png",                 // status bar icon
    image: data.image || undefined,            //  banner image
    vibrate: [100, 50, 100],
    actions: [
      {
        action: "open",
        title: "Open",
        icon: "/icons/favicon-32x32.png"
      }
    ],
    data: {
      url: data.url || "https://referlink.space",
      originalData: data
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", options)
  );
});


self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const data = event.notification.data.originalData || {};
  const jobId = data.jobId;  
  const targetUrl = "/?jobId=" + jobId;  // React will detect this and open popup

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(windowClients => {

        // If the app is already open → focus and send message
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin)) {
            client.postMessage({ type: "OPEN_JOB", jobId });
            return client.focus();
          }
        }

        // If app is closed → open a new window with jobId
        return clients.openWindow(targetUrl);
      })
  );
});
