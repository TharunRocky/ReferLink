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

  const url = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(windowClients => {
        for (let client of windowClients) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});