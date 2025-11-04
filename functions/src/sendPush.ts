// functions/src/sendPush.ts
import * as admin from "firebase-admin";

// initialize once
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Sends a notification to all FCM tokens under users/{uid}/fcmTokens/*
 */
export async function sendNotificationToUser(
  uid: string,
  payload: { title?: string; body?: string },
) {
  const tokensSnap = await admin
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("fcmTokens")
    .get();

  const tokens = tokensSnap.docs.map((d) => d.id);
  if (tokens.length === 0) {
    console.log(`⚠️ No tokens found for user ${uid}`);
    return;
  }

  const message = {
    notification: {
      title: payload.title || "Tulene 🦭",
      body: payload.body || "Máte novú správu!",
    },
    tokens,
  };

  const resp = await admin.messaging().sendEachForMulticast(message);
  console.log(
    `✅ Sent to ${tokens.length} tokens (${resp.successCount} success, ${resp.failureCount} failed)`,
  );
}

/**
 * Callable function for frontend
 */
import * as functions from "firebase-functions/v2";
export const sendUserNotification = functions.https.onCall(async (request) => {
  const { uid, title, body } = request.data;
  if (!uid)
    throw new functions.https.HttpsError("invalid-argument", "Missing uid");

  await sendNotificationToUser(uid, { title, body });
  return { success: true };
});
