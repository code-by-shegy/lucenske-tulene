import Header from "../components/Header";
import Button from "../components/Button";
import Page from "../components/Page";
import Card from "../components/Card";
import Table from "../components/Table";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/db_users";
import { getEventsByUser, getUserTopEvent } from "../lib/db_events";
import { getLeaderboard } from "../lib/db_leaderboard";
import { getAuth, signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { formatDateTime, formatTimeToMMSS } from "../utils/utils.ts";

import type {
  EventEntry,
  Standing,
  UserName,
  Points,
  EventsCount,
} from "../types";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [user_name, setName] = useState<UserName>("");
  const [points, setPoints] = useState<Points>(0);
  const [showers_count, setShowersCount] = useState<EventsCount>(0);
  const [events_count, setEventsCount] = useState<EventsCount>(0);
  const [standing, setStanding] = useState<Standing>(null);
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bestEvent, setBestEvent] = useState<EventEntry | null>(null);

  const rowsPerPage = 10;

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      // 1) Load user profile
      const user_profile = await getUser(user.uid);
      if (user_profile) {
        setName(user_profile.user_name || user.email || "Unknown");
        setPoints(user_profile.points || 0);
        setEventsCount(user_profile.events_count || 0);
        setShowersCount(user_profile.showers_count || 0);
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

  // Convert events into rows for Table component
  // Only cold plunges
  const coldPlungeAll = events.filter((ev) => ev.event_type === "cold_plunge");

  // Pagination based on cold plunges
  const coldPlungeTotalPages = Math.ceil(coldPlungeAll.length / rowsPerPage);

  const paginatedColdPlungeEvents = coldPlungeAll.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const user_events_rows = useMemo(
    () =>
      paginatedColdPlungeEvents.map((ev) => [
        <span className="font-bold">{formatDateTime(ev.date)}</span>,
        ev.water_temp,
        formatTimeToMMSS(ev.time_in_water),
        <span className="font-bold">{ev.points.toFixed(0)}</span>,
      ]),
    [paginatedColdPlungeEvents],
  );

  {
    /* Only cold showers */
  }
  const coldShowerAll = events.filter((ev) => ev.event_type === "cold_shower");

  // Pagination for showers
  const coldShowerTotalPages = Math.ceil(coldShowerAll.length / rowsPerPage);

  const paginatedColdShowerEvents = coldShowerAll.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const user_showers_rows = useMemo(
    () =>
      paginatedColdShowerEvents.map((ev) => [
        <span className="font-bold">{formatDateTime(ev.date)}</span>,
        ev.water_temp,
        formatTimeToMMSS(ev.time_in_water),
        <span className="font-bold">{ev.points.toFixed(0)}</span>,
      ]),
    [paginatedColdShowerEvents],
  );

  // Prepare best event row (or null if no event)
  const user_top_event_row = useMemo(
    () =>
      bestEvent
        ? [
            [
              <span className="font-bold">
                {formatDateTime(bestEvent.date)}
              </span>,
              bestEvent.water_temp,
              formatTimeToMMSS(bestEvent.time_in_water),
              <span className="font-bold">{bestEvent.points.toFixed(0)}</span>,
            ],
          ]
        : [],
    [bestEvent],
  );

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
      <Card className="mt-4 mb-4 text-center">
        <p className="font-bangers text-darkblack text-lg">
          <span className="mr-2">
            Poradie:{" "}
            <span className="text-mediumblue font-bangers">
              #{standing ?? "-"}
            </span>
          </span>
          <span className="mr-2">
            Body: <span className="text-mediumblue font-bangers">{points}</span>
          </span>
          <br />
          <span className="mr-2">
            Otužil:{" "}
            <span className="text-mediumblue font-bangers">
              {events_count + " x"}
            </span>
          </span>
          <span>
            Sprchy:{" "}
            <span className="text-mediumblue font-bangers">
              {showers_count + " x"}
            </span>
          </span>
        </p>
      </Card>
      {bestEvent && (
        <>
          <Table
            headers={["Dátum", "Voda (°C)", "Čas", "Body"]}
            rows={user_top_event_row}
            className="mb-4"
            title="Najlepší výkon"
          />
        </>
      )}
      {/* Sessions list */}
      <Table
        headers={["Dátum", "Voda (°C)", "Čas", "Body"]}
        rows={user_events_rows}
        className="mb-4"
        title="Otuženia"
      />

      {coldPlungeTotalPages > 1 && (
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
            {currentPage} / {coldPlungeTotalPages}
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={() =>
              setCurrentPage((p) => Math.min(coldPlungeTotalPages, p + 1))
            }
            disabled={currentPage === coldPlungeTotalPages}
          >
            Ďalšie
          </Button>
        </div>
      )}

      {/* Sprchy table */}
      <Table
        headers={["Dátum", "Voda (°C)", "Čas", "Body"]}
        rows={user_showers_rows}
        className="mb-4"
        title="Sprchy"
      />

      {coldShowerTotalPages > 1 && (
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
            {currentPage} / {coldShowerTotalPages}
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={() =>
              setCurrentPage((p) => Math.min(coldShowerTotalPages, p + 1))
            }
            disabled={currentPage === coldShowerTotalPages}
          >
            Ďalšie
          </Button>
        </div>
      )}
    </Page>
  );
}
