import { useEffect, useState } from "react";
import { getLeaderboard } from "../lib/leaderboard";
import Header from "../components/Header";

type LeaderboardEntry = {
  id: string;
  name: string;
  events_count: number;
  points: number;
};

export default function Leaderboard() {
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
      <div className="flex h-screen items-center justify-center">Loading…</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Leaderboard" onBack={() => window.history.back()} />

      <div className="flex-1 p-4">
        <table className="w-full border-collapse rounded-lg shadow bg-white">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Sessions</th>
              <th className="p-3">Points</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="p-3">{entry.name}</td>
                <td className="p-3">{entry.events_count}</td>
                <td className="p-3 font-semibold">{entry.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
