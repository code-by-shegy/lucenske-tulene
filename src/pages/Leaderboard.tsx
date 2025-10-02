import Header from "../components/Header";
import Page from "../components/Page";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../lib/leaderboard";
import { useNavigate } from "react-router-dom";

import type { LeaderboardEntry } from "../types";

export default function Leaderboard() {
  const navigate = useNavigate();

  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaderboard = await getLeaderboard();
        setData(leaderboard);
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

  return (
    <Page>
      <Header title="Tabuľka" onBack={() => navigate("/")} />
      <Card className="overflow-x-auto flex-1">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-darkblue text-icywhite font-bangers text-shadow-lg/50">
              <th className="rounded-tl-2xl p-3">#</th>
              <th className="p-3">Tuleň</th>
              <th className="p-3">Otuženia</th>
              <th className="rounded-tr-2xl p-3">Body</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr
                key={entry.user_id}
                className={`border-mediumgrey hover:bg-lightblue/10 border-t transition-colors`}
              >
                <td className="text-darkblack p-3 font-bold">{index + 1}</td>
                <td className="p-3">{entry.user_name}</td>
                <td className="p-3">{entry.events_count}</td>
                <td className="text-darkblack p-3 font-bold">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}
