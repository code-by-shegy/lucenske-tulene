import Header from "../components/Header";
import Page from "../components/Page";
import Table from "../components/Table";
import { useEffect, useState, useMemo } from "react";
import { getLeaderboard, getAllUsersTopEvents } from "../lib/db_leaderboard";
import { useAuth } from "../context/AuthContext";
import { formatTimeToMMSS } from "../utils/utils.ts";
import type { LeaderboardEntry, EventEntry } from "../types";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const [topEvents, setTopEvents] = useState<
    (EventEntry & { user_name: string })[]
  >([]);
  const [loadingTopEvents, setLoadingTopEvents] = useState(true);

  const { user } = useAuth();

  // Load overall leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboard = await getLeaderboard();
        setEntries(leaderboard);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Load top events
  useEffect(() => {
    const fetchTopEvents = async () => {
      try {
        const events = await getAllUsersTopEvents();
        setTopEvents(events);
      } catch (err) {
        console.error("Error loading top events:", err);
      } finally {
        setLoadingTopEvents(false);
      }
    };
    fetchTopEvents();
  }, []);

  if (loadingLeaderboard && loadingTopEvents) {
    return (
      <div className="font-bangers bg-lightgrey text-darkblack flex h-screen items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  // Convert leaderboard data to rows
  const leaderboardRows = useMemo(
    () =>
      entries.map((entry, index) => {
        const isCurrentUser = user?.uid === entry.user_id;
        return {
          rowClassName: isCurrentUser ? "bg-lightblue/20" : "bg-icywhite",
          cells: [
            <span className="font-bold">{index + 1}</span>,
            entry.user_name ?? "–",
            (entry.events_count ?? 0) + " x",
            (entry.showers_count ?? 0) + " x",
            <span className="font-bold">{(entry.points ?? 0).toFixed(0)}</span>,
          ],
        };
      }),
    [entries, user?.uid],
  );

  // Convert top events to rows
  const topEventRows = useMemo(
    () =>
      topEvents.map((entry, index) => {
        const isCurrentUser = user?.uid === entry.user_id;
        return {
          rowClassName: isCurrentUser ? "bg-lightblue/20" : "bg-icywhite",
          cells: [
            <span className="font-bold">{index + 1}</span>,
            entry.user_name ?? "–",
            entry.water_temp ?? "–",
            formatTimeToMMSS(entry.time_in_water),
            <span className="font-bold">{entry.points.toFixed(0)}</span>,
          ],
        };
      }),
    [topEvents, user?.uid],
  );

  return (
    <Page className="pb-[10vh]">
      <Header title="Tabuľky" />

      {/* Overall leaderboard */}
      <Table
        className="mb-4"
        headers={["#", "Tuleň", "Otužil", "Sprchy", "Body"]}
        rows={leaderboardRows.map((r) => r.cells)}
        rowClassNames={leaderboardRows.map((r) => r.rowClassName)}
        title="Celkové poradie"
        titleClassName="mt-2 text-3xl"
      />

      {/* Top performances table */}
      {loadingTopEvents ? (
        <div className="font-bangers text-darkblack mb-4 flex items-center justify-center text-lg">
          Načítavam najlepšie výkony...
        </div>
      ) : (
        <Table
          className="mb-4"
          headers={["#", "Tuleň", "Voda (°C)", "Čas", "Body"]}
          rows={topEventRows.map((r) => r.cells)}
          rowClassNames={topEventRows.map((r) => r.rowClassName)}
          title="Najlepšie výkony"
          titleClassName="mt-2 text-3xl"
        />
      )}
    </Page>
  );
}
