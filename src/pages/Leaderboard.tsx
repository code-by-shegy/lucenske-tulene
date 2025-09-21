import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Leaderboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Header title="Leaderboard" onBack={() => navigate("/")} />
      <div className="flex-1 flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>
    </div>
  );
}
