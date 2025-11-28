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

messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icons/logo.png"
  });
});