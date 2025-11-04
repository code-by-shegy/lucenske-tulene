// src/lib/messaging.ts
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { app, db } from "../firebase";
import type { MessagePayload } from "firebase/messaging";

/**
 * Request permission and register FCM token for a logged-in user.
 */
export async function registerForPushNotifications(
  user: { uid: string } | null,
  vapidKey: string,
) {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.warn("Push notifications not supported in this browser.");
    return null;
  }

  if (!user) {
    console.warn("User not logged in — skipping push registration");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notifications permission not granted");
      return null;
    }

    const messaging = getMessaging(app);

    // ✅ Important: must use the same VAPID key from Firebase Console > Cloud Messaging > Web Push certificates
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.ready, // ensures SW is ready
    });

    if (!token) {
      console.warn(
        "No registration token available. Request permission to generate one.",
      );
      return null;
    }

    // Save token to Firestore under users/{uid}/fcmTokens/{token}
    const tokenDocRef = doc(db, "users", user.uid, "fcmTokens", token);
    await setDoc(tokenDocRef, { createdAt: new Date().toISOString() });

    // ✅ Save token locally for logout cleanup
    localStorage.setItem("fcm_token", token);

    console.log("✅ Registered push token:", token);
    return token;
  } catch (err) {
    console.error("registerForPushNotifications error:", err);
    return null;
  }
}

/**
 * Remove FCM token when user logs out.
 */
export async function unregisterPushToken(userId: string, token: string) {
  try {
    const tokenDocRef = doc(db, "users", userId, "fcmTokens", token);
    await deleteDoc(tokenDocRef);
    console.log("🗑️ Deleted FCM token:", token);
  } catch (err) {
    console.warn("Failed to delete token:", err);
  }
}

/**
 * Setup listener for foreground messages (when app is open).
 */
export function setupForegroundHandler() {
  try {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload: MessagePayload) => {
      console.log("📩 Foreground message received:", payload);
      const title = payload?.notification?.title ?? "Tulene";
      const body = payload?.notification?.body ?? "";
      toast(`${title}${body ? ` — ${body}` : ""}`);
    });
  } catch (err) {
    console.warn("Foreground handler setup failed:", err);
  }
}
