import Header from "../components/Header";
import Page from "../components/Page";
import Table from "../components/Table";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboard, getAllUsersTopEvents } from "../lib/db_leaderboard";
import { useAuth } from "../context/AuthContext";
import { formatTimeToMMSS } from "../utils/utils.ts";

export default function Leaderboard() {
  const { user } = useAuth();

  // --- React Query for leaderboard ---
  const { data: entries = [], isLoading: loadingLeaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  // --- React Query for top events ---
  const { data: topEvents = [], isLoading: loadingTopEvents } = useQuery({
    queryKey: ["topEvents"],
    queryFn: getAllUsersTopEvents,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });

  // --- Convert leaderboard to rows ---
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

  // --- Convert top events to rows ---
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
      {loadingLeaderboard ? (
        <div>Načítávam celkové poradie...</div>
      ) : (
        <Table
          className="mb-4"
          headers={["#", "Tuleň", "Otužil", "Sprchy", "Body"]}
          rows={leaderboardRows.map((r) => r.cells)}
          rowClassNames={leaderboardRows.map((r) => r.rowClassName)}
          title="Celkové poradie"
          titleClassName="mt-2 text-3xl"
        />
      )}
      {/* Top performances table */}
      {loadingTopEvents ? (
        <div>Načítávam najlepšie výkony...</div>
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
