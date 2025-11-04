// public/firebase-messaging-sw.js

// These scripts are for service worker. They initialize Firebase (so it knows which project to use),
// handle background push notifications from Firebase Cloud Messaging (FCM)
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js",
);

// Put your firebase config (same as src/firebase.ts) here:
const firebaseConfig = {
  apiKey: "AIzaSyAQQyBlwyw1WLF_Xkm60r89LebST8LjEHs",
  authDomain: "lucenske-tulene-ff2f7.firebaseapp.com",
  projectId: "lucenske-tulene-ff2f7",
  storageBucket: "lucenske-tulene-ff2f7.firebasestorage.app",
  messagingSenderId: "134589697796",
  appId: "1:134589697796:web:80363952dc8e2108bdca51",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Background / push notification handler
messaging.onBackgroundMessage(function (payload) {
  // payload.notification has title/body typical
  const notificationTitle = payload?.notification?.title ?? "Tulene";
  const notificationOptions = {
    body: payload?.notification?.body ?? "",
    icon:
      payload?.notification?.icon ??
      "/lucenske_tulene_logo_blue_background_192.png",
    data: payload?.data ?? {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
