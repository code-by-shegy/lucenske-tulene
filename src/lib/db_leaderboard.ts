import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type { LeaderboardEntry, EventEntry } from "../types";
import { getUserTopEvent } from "./db_events";

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const q = query(collection(db, "users"), orderBy("points", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      user_id: doc.id,
      user_name: data.user_name,
      showers_count: data.showers_count,
      events_count: data.events_count,
      points: data.points,
    };
  });
}
export async function getAllUsersTopEvents(): Promise<
  (EventEntry & { user_name: string })[]
> {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = usersSnapshot.docs.map((doc) => ({
    uid: doc.id,
    user_name: doc.data().user_name, // ✅ grab user_name here
  }));

  const topEvents: (EventEntry & { user_name: string })[] = [];
  for (const u of users) {
    const topEvent = await getUserTopEvent(u.uid);
    if (topEvent) {
      topEvents.push({
        ...topEvent,
        user_name: u.user_name, // ✅ attach user_name to event
      });
    }
  }

  // Sort descending by points
  topEvents.sort((a, b) => (b.points ?? 0) - (a.points ?? 0));

  return topEvents;
}
