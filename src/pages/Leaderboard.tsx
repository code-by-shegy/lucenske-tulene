import Header from "../components/Header";
import Page from "../components/Page";
import Table from "../components/Table";
import IconHeaderTable from "../components/IconTableHeader";

import { useMemo } from "react";
import { ICONS, WEATHER_ICON_MAP } from "../constants";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { formatTimeToMMSS } from "../utils/utils.ts";
import { getLeaderboard, getAllUsersTopEvents } from "../lib/db_leaderboard";

export default function Leaderboard() {
  const { user } = useAuth();

  console.log("ICONS:", ICONS); // 👈 add this

  // --- React Query for leaderboard ---
  const { data: leaderboard = [], isLoading: loadingLeaderboard } = useQuery({
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
      leaderboard.map((entry, index) => {
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
    [leaderboard, user?.uid],
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
            formatTimeToMMSS(entry.time_in_water),
            entry.water_temp ?? "–",
            entry.air_temp ?? "–",
            <IconHeaderTable
              src={
                WEATHER_ICON_MAP[entry.weather] ?? ICONS.compact.weather.sunny
              }
              alt="Počasie"
              size="h-[60%] w-auto"
            />,
            <span className="font-bold">{entry.points.toFixed(0)}</span>,
          ],
        };
      }),
    [topEvents, user?.uid],
  );

  if (loadingTopEvents && loadingLeaderboard) {
    return (
      <div className="font-bangers text-darkblack flex h-screen items-center justify-center px-3 text-center text-4xl sm:text-5xl md:text-6xl">
        Načítávam tabuľky...
      </div>
    );
  }

  return (
    <Page className="pb-[10vh]">
      <Header title="Tabuľky" />

      {/* Overall leaderboard */}
      <Table
        className="mb-4"
        headers={[
          "#",
          <IconHeaderTable
            src={ICONS.compact.seal}
            alt="Tuleň"
            size="h-[80%] w-auto"
          />,
          <IconHeaderTable
            src={ICONS.compact.coldPlunge}
            alt="Otužil"
            size="h-[80%] w-auto"
          />,
          <IconHeaderTable
            src={ICONS.compact.coldShower}
            alt="Sprchy"
            size="h-[80%] w-auto"
          />,
          <IconHeaderTable
            src={ICONS.compact.sealPoints}
            alt="Body"
            size="h-[80%] w-auto"
          />,
        ]}
        rows={leaderboardRows.map((r) => r.cells)}
        rowClassNames={leaderboardRows.map((r) => r.rowClassName)}
        title="Celkové poradie"
        titleClassName="mt-2"
      />

      {/* Top events table */}
      <Table
        className="mb-4"
        headers={[
          "#",
          <IconHeaderTable
            src={ICONS.compact.seal}
            alt="Tuleň"
            size="h-[80%] w-auto"
          />,
          <IconHeaderTable
            src={ICONS.compact.stopwatch}
            alt="Čas"
            size="h-[80%] w-auto"
          />,
          <IconHeaderTable
            src={ICONS.compact.waterTemp}
            alt="Voda (°C)"
            size="h-[80%] w-auto"
          />,
          <IconHeaderTable
            src={ICONS.compact.airTemp}
            alt="Vzduch (°C)"
            size="h-[80%] w-auto"
          />,
          <IconHeaderTable
            src={ICONS.compact.weather.sunny}
            alt="Počasie"
            size="h-[80%] w-auto"
          />,
          <IconHeaderTable
            src={ICONS.compact.sealPoints}
            alt="Body"
            size="h-[80%] w-auto"
          />,
        ]}
        rows={topEventRows.map((r) => r.cells)}
        rowClassNames={topEventRows.map((r) => r.rowClassName)}
        title="Najlepšie výkony"
      />
    </Page>
  );
}
