import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ==========================
// USERS
// ==========================

// 1) Create a new user profile
export async function createUser(userId: string, email: string, name: string) {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    email,
    name,
    avatar_url: null,
    points: 0,
    events_count: 0,
    standing: null,
  });
}

// 2) Ensure profile exists (used after login/registration)
export async function ensureUserProfile(
  userId: string,
  email: string,
  name: string
) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await createUser(userId, email, name);
  }
}

// 3) Get user by ID
export async function getUser(userId: string) {
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

// ==========================
// EVENTS
// ==========================

// 4) Create a new event and update user stats
export async function createEvent(
  userId: string,
  date: Date,
  water_temp: number,
  time_in_water: number,
  points: number,
  photo_url: string | null
) {
  // Add event
  await addDoc(collection(db, "events"), {
    userId,
    date: Timestamp.fromDate(date),
    water_temp,
    time_in_water,
    points,
    photo_url,
  });

  // Update user stats
  const userRef = doc(db, "users", userId);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    const user = snap.data();
    await updateDoc(userRef, {
      points: (user.points || 0) + points,
      events_count: (user.events_count || 0) + 1,
    });
  }
}

// 5) Get events for a user, sorted by date
export async function getEventsByUser(userId: string) {
  const q = query(
    collection(db, "events"),
    where("userId", "==", userId),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ==========================
// LEADERBOARD
// ==========================

// 6) Get leaderboard, sorted by points
export async function getLeaderboard() {
  const q = query(collection(db, "users"), orderBy("points", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      events_count: data.events_count,
      points: data.points,
    };
  });
}