import Header from "../components/Header";
import Button from "../components/Button";
import Page from "../components/Page";
import Card from "../components/Card";
import Table from "../components/Table";

import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/db_users";
import { getEventsByUser, getUserTopEvent } from "../lib/db_events";
import { getLeaderboard } from "../lib/db_leaderboard";
import { getAuth, signOut } from "firebase/auth";
import { LogOut } from "lucide-react";

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
  const [bestEvent, setBestEvent] = useState<EventEntry | null>(null);

  const rowsPerPage = 5;
  const totalPages = Math.ceil(events.length / rowsPerPage);

  const paginatedEvents = events.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
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

      // 4) Load top (best) event
      const best = await getUserTopEvent(user.uid);
      if (best) setBestEvent(best);
    }
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log("User signed out");
      navigate("/login"); // redirect after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDateTime = (date?: Date | null): string => {
    if (!date) return "—";

    return date.toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Convert events into rows for Table component
  const user_events_rows = paginatedEvents.map((ev) => [
    <span className="font-bold">{formatDateTime(ev.date)},</span>, // datetime bold
    ev.water_temp,
    formatTime(ev.time_in_water), // display as MM:SS
    <span className="font-bold">{ev.points.toFixed(0)}</span>, // points bold
  ]);

  // Prepare best event row (or null if no event)
  const user_top_event_row = bestEvent
    ? [
        [
          <span className="font-bold">{formatDateTime(bestEvent.date)}</span>,
          bestEvent.water_temp,
          formatTime(bestEvent.time_in_water),
          <span className="font-bold">{bestEvent.points.toFixed(0)}</span>,
        ],
      ]
    : [];

  return (
    <Page className="pb-[10vh]">
      {/*So the bottom navbar does not cover content*/}
      <Header
        title={`Tuleň ${user_name}`}
        rightSlot={
          <button onClick={handleLogout} className="text-icywhite text-2xl">
            <LogOut size="1em" strokeWidth={4} />
          </button>
        }
      />
      {/* Stats summary */}
      <Card className="rounded-none p-0 text-center">
        <p className="font-bangers text-darkblack text-lg">
          <span className="mr-4">
            Poradie:{" "}
            <span className="text-mediumblue font-bangers">
              #{standing ?? "-"}
            </span>
          </span>
          <span className="mr-4">
            Body: <span className="text-mediumblue font-bangers">{points}</span>
          </span>
          <span>
            Otužil:{" "}
            <span className="text-mediumblue font-bangers">
              {events_count + " x"}
            </span>
          </span>
        </p>
      </Card>
      {bestEvent && (
        <>
          <h2 className="font-bangers text-darkblack pl-3 text-lg">
            Najlepší výkon
          </h2>
          <Table
            headers={["Dátum", "Voda (°C)", "Čas", "Body"]}
            rows={user_top_event_row}
          />
        </>
      )}
      {/* Sessions list */}
      <h2 className="font-bangers text-darkblack pl-3 text-lg">Otuženia</h2>
      <Table
        headers={["Dátum", "Voda (°C)", "Čas", "Body"]}
        rows={user_events_rows}
      />

      {totalPages > 1 && (
        <div className="flex justify-center gap-3 p-3">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Späť
          </Button>
          <span className="font-bangers text-darkblack flex items-center">
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
    </Page>
  );
}
