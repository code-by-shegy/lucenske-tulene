import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import type { LeaderboardEntry } from "../types";

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
