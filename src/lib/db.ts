// src/lib/db.ts
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ==========================
// USERS
// ==========================

export async function ensureUserProfile(
  uid: string,
  email: string | null,
  nickname: string
) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email,
      name: nickname,
      avatar_url: null,
      points: 0,
      events_count: 0,
      standing: 0,
      createdAt: serverTimestamp(),
    });
  }
}

export async function getUser(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// ==========================
// EVENTS
// ==========================

export async function addEvent(
  uid: string,
  water_temp: number,
  time_in_water: number,
  photo_url: string | null
) {
  const eventsRef = collection(db, "events");

  const points = Math.round(time_in_water * (20 - water_temp));

  const newEvent = {
    uid,
    date: serverTimestamp(),
    water_temp,
    time_in_water,
    points,
    photo_url,
  };

  const eventDoc = await addDoc(eventsRef, newEvent);

  // update user stats
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const u = userSnap.data();
    await updateDoc(userRef, {
      points: (u.points || 0) + points,
      events_count: (u.events_count || 0) + 1,
    });
  }

  return eventDoc.id;
}

export async function getEventsByUser(uid: string) {
  const q = query(
    collection(db, "events"),
    where("uid", "==", uid),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ==========================
// LEADERBOARD
// ==========================

export async function getLeaderboard(limit: number = 10) {
  const q = query(collection(db, "users"), orderBy("points", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
