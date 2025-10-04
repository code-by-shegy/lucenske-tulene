import Header from "../components/Header";
import Button from "../components/Button";
import Page from "../components/Page";
import Card from "../components/Card";
import Table from "../components/Table";

import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/users";
import { getEventsByUser } from "../lib/events";
import { getLeaderboard } from "../lib/leaderboard";
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
  const rows = paginatedEvents.map((ev) => [
    <span className="font-bold">{formatDateTime(ev.date)},</span>, // datetime bold
    ev.water_temp,
    formatTime(ev.time_in_water), // display as MM:SS
    <span className="font-bold">{ev.points.toFixed(1)}</span>, // points bold
  ]);

  return (
    <Page className="pb-[10vh]">
      {/*So the bottom navbar does not cover content*/}
      <Header
        title={`Tuleň ${user_name}`}
        onBack={() => navigate("/")}
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
            Otuženia:{" "}
            <span className="text-mediumblue font-bangers">{events_count}</span>
          </span>
        </p>
      </Card>
      {/* Sessions list */}
      <Table
        headers={["DÁTUM", "TEPLOTA VODY (°C)", "ČAS (MM:SS)", "BODY"]}
        rows={rows}
      />

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
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
    </Page>
  );
}
