import Header from "../components/Header";

import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/users";
import { getEventsByUser } from "../lib/events";
import { getLeaderboard } from "../lib/leaderboard";

import type { 
  EventEntry, Standing, UserName, Points, EventsCount 
} from "../types";

export default function Profile() {
  const navigate = useNavigate();

  const [user_name, setName] = useState<UserName>("");
  const [points, setPoints] = useState<Points>(0);
  const [events_count, setEventsCount] = useState<EventsCount>(0);
  const [standing, setStanding] = useState<Standing>(null);
  const [events, setEvents] = useState<EventEntry[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      const user = auth.currentUser;
      if (!user) return;

      // 1) Load user profile
      const user_profile = await getUser(user.uid);
      if (user_profile) {
        setName(user_profile.user_name || user.email || "Unknown");
        setPoints(user_profile.points || 0);
        setEventsCount(user_profile.events_count || 0);
      }

      // 2) Load leaderboard and find user’s rank
      const leaderboard = await getLeaderboard();
      const rank = leaderboard.findIndex((entry) => entry.user_id === user.uid);
      if (rank !== -1) setStanding(rank + 1);

      // 3) Load events
      const userEvents = await getEventsByUser(user.uid);
      setEvents(userEvents);
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title={`${user_name}'s profile`} onBack={() => navigate("/")} />

      {/* Stats summary */}
      <div className="p-6 text-center bg-white shadow">
        <p className="text-lg font-bold">
          Standing: #{standing ?? "-"} | Points: {points} | Sessions: {events_count}
        </p>
      </div>

      {/* Sessions list */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">Sessions</h2>
        <table className="w-full table-auto border-collapse bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Water Temp (°C)</th>
              <th className="p-3 text-left">Time (s)</th>
              <th className="p-3 text-left">Points</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.event_id} className="border-t">
                <td className="p-3">
                  {ev.date ? ev.date.toLocaleDateString() : "—"}
                </td>
                <td className="p-3">{ev.water_temp}</td>
                <td className="p-3">{ev.time_in_water}</td>
                <td className="p-3">{ev.points.toFixed(1)}</td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-500">
                  No sessions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}