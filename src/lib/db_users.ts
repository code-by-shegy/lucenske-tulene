import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import type { UserId, UserName, UserProfile, Email } from "../types";

//add approved field to USER.
export async function createUser(
  user_id: UserId,
  email: Email,
  user_name: UserName,
) {
  const userRef = doc(db, "users", user_id);
  await setDoc(
    userRef,
    {
      user_name,
      email,
      avatar_url: null,
      points: 0,
      events_count: 0,
      showers_count: 0,
      approved: false,
    },
    { merge: true },
  );
}

export async function ensureUserProfile(
  user_id: UserId,
  email: Email,
  user_name: UserName,
) {
  const userRef = doc(db, "users", user_id);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await createUser(user_id, email, user_name);
  }
}

export async function getUser(user_id: UserId): Promise<UserProfile | null> {
  const userRef = doc(db, "users", user_id);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}
