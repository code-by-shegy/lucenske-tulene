import Header from "../components/Header";
import Button from "../components/Button";

import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/users";
import { getEventsByUser } from "../lib/events";
import { getLeaderboard } from "../lib/leaderboard";

import type {
  EventEntry,
  Standing,
  UserName,
  Points,
  EventsCount,
} from "../types";

export default function Profile() {
  const navigate = useNavigate();

  const [user_name, setName] = useState<UserName>("");
  const [points, setPoints] = useState<Points>(0);
  const [events_count, setEventsCount] = useState<EventsCount>(0);
  const [standing, setStanding] = useState<Standing>(null);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(events.length / rowsPerPage);
  
  const paginatedEvents = events.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
    <div className="min-h-screen flex flex-col bg-lightgrey">
      <Header title={`Tuleň ${user_name}`} onBack={() => navigate("/")} />

      {/* Stats summary */}
      <div className="p-6 text-center bg-white shadow rounded-b-2xl">
        <p className="text-lg font-bangers text-darkblack">
          <span className="mr-4">
            Poradie:{" "}
            <span className="text-mediumblue font-bangers">
              #{standing ?? "-"}
            </span>
          </span>
          <span className="mr-4">
            Body:{" "}
            <span className="text-mediumblue font-bangers">{points}</span>
          </span>
          <span>
            Otuženia:{" "}
            <span className="text-mediumblue font-bangers">{events_count}</span>
          </span>
        </p>
      </div>

      {/* Sessions list */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bangers mb-4 text-darkblack">Otuženia</h2>

        <div className="overflow-x-auto rounded-2xl shadow-lg bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-darkblue text-icywhite font-bangers text-shadow-lg/50">
                <th className="p-3 rounded-tl-2xl">Dátum</th>
                <th className="p-3">Teplota vody (°C)</th>
                <th className="p-3">Čas (s)</th>
                <th className="p-3 rounded-tr-2xl">Body</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map((ev) => (
                <tr
                  key={ev.event_id}
                  className="border-t border-mediumgrey hover:bg-lightblue/10 transition-colors"
                >
                  <td className="p-3">{ev.date ? ev.date.toLocaleDateString() : "—"}</td>
                  <td className="p-3">{ev.water_temp}</td>
                  <td className="p-3">{ev.time_in_water}</td>
                  <td className="p-3 font-bold text-darkblack">{ev.points.toFixed(1)}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-6 text-center text-mediumgrey2 font-bangers"
                  >
                    No sessions yet 🚀
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Späť
              </Button>
              <span className="font-bangers text-darkblack">
                {currentPage} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Ďalšie
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}