// src/lib/messaging.ts
import { getMessaging, getToken, onMessage } from "firebase/messaging";

import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { app, db } from "../firebase";

import type { MessagePayload } from "firebase/messaging";

/**
 * Call this to request permission and register token for a logged in user.
 * Returns FCM token string or null.
 */
export async function registerForPushNotifications(
  user: { uid: string } | null,
  vapidKey: string,
) {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.warn("Push notifications not supported in this browser.");
    return null;
  }

  if (!user) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey });

    if (!token) {
      console.warn(
        "No registration token available. Request permission to generate one.",
      );
      return null;
    }

    // Save token to Firestore under users/{uid}/fcmTokens/{token}
    // or users/{uid} -> fcmToken: token (choose structure).
    // Example: store under doc users/{uid}/fcmTokens/{token}
    const tokenDocRef = doc(db, "users", user.uid, "fcmTokens", token);
    await setDoc(tokenDocRef, { createdAt: new Date().toISOString() });

    return token;
  } catch (err) {
    console.error("registerForPushNotifications error:", err);
    return null;
  }
}

/**
 * Call to remove token when user logs out (cleanup).
 */
export async function unregisterPushToken(userId: string, token: string) {
  try {
    const tokenDocRef = doc(db, "users", userId, "fcmTokens", token);
    await deleteDoc(tokenDocRef);
  } catch (err) {
    console.warn("Failed to delete token:", err);
  }
}

/**
 * Hook up foreground message handler so that when your app is open you display a toast
 */
export function setupForegroundHandler() {
  try {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload: MessagePayload) => {
      console.log("Foreground message received:", payload);
      // show local toast
      const title = payload?.notification?.title ?? "Tulene";
      const body = payload?.notification?.body ?? "";
      toast(title + (body ? ` — ${body}` : ""));
    });
  } catch (err) {
    console.warn("Foreground handler setup failed:", err);
  }
}
