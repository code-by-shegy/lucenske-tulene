import Header from "../components/Header";
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
      <div className="flex h-screen items-center justify-center font-bangers bg-lightgrey text-darkblack text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-lightgrey">
      <Header title="Tabuľka" onBack={() => navigate("/")} />

      <div className="flex-1 p-4">
        <div className="overflow-x-auto rounded-2xl shadow-lg bg-icywhite">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-darkblue text-icywhite font-bangers text-shadow-lg/50">
                <th className="p-3 rounded-tl-2xl">#</th>
                <th className="p-3">Tuleň</th>
                <th className="p-3">Otuženia</th>
                <th className="p-3 rounded-tr-2xl">Body</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr
                  key={entry.user_id}
                  className={`border-t border-mediumgrey hover:bg-lightblue/10 transition-colors`}
                >
                  <td className="p-3 font-bold text-darkblack">{index + 1}</td>
                  <td className="p-3 ">{entry.user_name}</td>
                  <td className="p-3 ">{entry.events_count}</td>
                  <td className="p-3 font-bold text-darkblack">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}