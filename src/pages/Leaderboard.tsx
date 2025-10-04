import Header from "../components/Header";
import Page from "../components/Page";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../lib/leaderboard";
import { useNavigate } from "react-router-dom";

import type { LeaderboardEntry } from "../types";

export default function Leaderboard() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboard = await getLeaderboard();
        setEntries(leaderboard);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="font-bangers bg-lightgrey text-darkblack flex h-screen items-center justify-center text-2xl">
        Loading...
      </div>
    );
  }

  // Convert leaderboard data to rows compatible with Table component
  const rows = entries.map((entry, index) => [
    <span className="font-bold">{index + 1}</span>, // rank bold
    entry.user_name,
    entry.events_count,
    <span className="font-bold">{entry.points.toFixed(1)}</span>, // points bold
  ]);

  return (
    <Page className="pb-[10vh]">
      {/*So the bottom navbar does not cover content*/}
      <Header title="Tabuľka" onBack={() => navigate("/")} />
      <Table headers={["#", "Tuleň", "Otuženia", "Body"]} rows={rows} />
    </Page>
  );
}
