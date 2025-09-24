import { 
  collection, doc, getDoc, getDocs, query, setDoc,
  updateDoc, where, orderBy, addDoc
} from "firebase/firestore";

import type {
  UserId, UserName, UserProfile, Email, Url, Points, 
  WaterTempCelsius, TimeInSeconds, EventEntry, LeaderboardEntry,
} from "../types";

import { db } from "../firebase";

// ==========================
// USERS
// ==========================

export async function createUser(user_id: UserId, email: Email, user_name: UserName) {
  const userRef = doc(db, "users", user_id);
  await setDoc(userRef, {
    user_name,
    email,
    avatar_url: null,
    points: 0,
    events_count: 0,
    standing: null,
  });
}

// 2) Ensure profile exists (used after login/registration)
export async function ensureUserProfile(
  user_id: UserId,
  email: Email,
  user_name: UserName
) {
  const userRef = doc(db, "users", user_id);
  const snap = await getDoc(userRef);
  if (!snap.exists()) {
    await createUser(user_id, email, user_name);
  }
}

// 3) Get user by ID
export async function getUser(user_id: UserId): Promise <UserProfile | null> {
  const userRef = doc(db, "users", user_id);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() as UserProfile : null;
}

// ==========================
// EVENTS
// ==========================

// 4) Create a new event and update user stats
export async function createEvent(
  user_id: UserId,
  date: Date,
  water_temp: WaterTempCelsius,
  time_in_water: TimeInSeconds,
  points: Points,
  photo_url: Url
) {
  // Add event
  await addDoc(collection(db, "events"), {
    user_id,
    date,
    water_temp,
    time_in_water,
    points,
    photo_url,
  });

  // Update user stats
  const userRef = doc(db, "users", user_id);
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
export async function getEventsByUser(user_id: UserId): Promise<EventEntry[]> {
  const q = query(
    collection(db, "events"),
    where("user_id", "==", user_id),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      event_id: doc.id,
      user_id,
      date: data.date?.toDate ? data.date.toDate() : null, // Firestore Timestamp → Date @todo:check
      water_temp: data.water_temp ?? null,
      time_in_water: data.time_in_water ?? null,
      points: data.points ?? 0,
      photo_url: data.photo_url ?? null,
    };
  });
}

// ==========================
// LEADERBOARD
// ==========================

// 6) Get leaderboard, sorted by points
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const q = query(collection(db, "users"), orderBy("points", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      user_id: doc.id,
      user_name: data.user_name,
      events_count: data.events_count,
      points: data.points,
    };
  });
}