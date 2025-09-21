// src/lib/users.ts
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Ensure there is a users/{uid} doc for this auth user.
 * Creates it if missing, and updates lastSeen if exists.
 * Accepts an optional displayName (nickname) to store on first creation.
 */
export async function ensureUserProfile(
  uid: string,
  email: string | null,
  displayName?: string
) {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  const now = serverTimestamp();

  if (!snap.exists()) {
    // create profile doc
    await setDoc(userRef, {
      email: email ?? null,
      displayName: displayName ?? null,
      avatarUrl: null,
      createdAt: now,
      lastSeen: now,
      eventsCount: 0,
    });
  } else {
    // update lastSeen (merge so we don't overwrite)
    await setDoc(userRef, { lastSeen: now }, { merge: true });

    // If a displayName was provided and the doc has none, set it (merge)
    if (displayName) {
      const data = snap.data();
      if (!data?.displayName) {
        await setDoc(userRef, { displayName }, { merge: true });
      }
    }
  }
}