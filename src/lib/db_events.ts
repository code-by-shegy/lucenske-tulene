import { db } from "../firebase";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy,
  addDoc,
  Timestamp,
  limit,
} from "firebase/firestore";

import type {
  UserId,
  Url,
  Points,
  TempCelsius,
  TimeInSeconds,
  EventEntry,
  Weather,
  EventType,
  Title,
  Location,
} from "../types";

export async function createEvent(
  user_id: UserId,
  date: Date,
  water_temp: TempCelsius,
  air_temp: TempCelsius,
  weather: Weather,
  time_in_water: TimeInSeconds,
  points: Points,
  photo_url: Url,
  event_type: EventType,
  location: Location,
  title: Title,
) {
  await addDoc(collection(db, "events"), {
    user_id,
    date: Timestamp.fromDate(date),
    water_temp,
    air_temp,
    weather,
    time_in_water,
    points,
    photo_url,
    event_type,
    location,
    title,
  });

  // Update user stats
  const userRef = doc(db, "users", user_id);
  const snap = await getDoc(userRef);

  if (!snap.exists()) return;

  const user = snap.data();

  // Always increase points
  const updates: Record<string, any> = {
    points: (user.points || 0) + points,
  };

  // Increment event/shower counts based on type
  if (event_type === "cold_plunge") {
    updates.events_count = (user.events_count || 0) + 1;
  } else if (event_type === "cold_shower") {
    updates.showers_count = (user.showers_count || 0) + 1;
  }

  await updateDoc(userRef, updates);
}

export async function getEventsByUser(user_id: UserId): Promise<EventEntry[]> {
  const q = query(
    collection(db, "events"),
    where("user_id", "==", user_id),
    orderBy("date", "desc"),
  );
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      event_id: doc.id,
      user_id,
      date: data.date?.toDate ? data.date.toDate() : null, // ✅ normalize Timestamp → Date
      water_temp: data.water_temp ?? null,
      air_temp: data.air_temp ?? null,
      weather: data.weather ?? 1,
      time_in_water: data.time_in_water ?? null,
      points: data.points ?? 0,
      photo_url: data.photo_url ?? null,
      event_type: data.event_type ?? null,
      location: data.location ?? null,
      title: data.title ?? null,
    };
  });
}

export async function getUserTopEvent(
  user_id: UserId,
): Promise<EventEntry | null> {
  const q = query(
    collection(db, "events"),
    where("user_id", "==", user_id),
    orderBy("points", "desc"),
    // this limits Firestore to only 1 result (the top one)
    // to save bandwidth and speed up response
    limit(1),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();

  return {
    event_id: docSnap.id,
    user_id,
    date: data.date?.toDate ? data.date.toDate() : null,
    water_temp: data.water_temp ?? null,
    air_temp: data.air_temp ?? null,
    weather: data.weather ?? 1,
    time_in_water: data.time_in_water ?? null,
    points: data.points ?? 0,
    photo_url: data.photo_url ?? null,
    event_type: data.event_type ?? null,
    location: data.location ?? null,
    title: data.title ?? null,
  };
}
