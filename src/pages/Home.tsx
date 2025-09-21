import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 p-4 bg-gray-100">
      <button
        onClick={() => navigate("/session")}
        className="w-full max-w-xs p-6 text-xl font-bold text-white bg-blue-500 rounded-2xl shadow-lg"
      >
        Start a new session
      </button>
      <button
        onClick={() => navigate("/leaderboard")}
        className="w-full max-w-xs p-6 text-xl font-bold text-white bg-green-500 rounded-2xl shadow-lg"
      >
        Leaderboard
      </button>
      <button
        onClick={() => navigate("/profile")}
        className="w-full max-w-xs p-6 text-xl font-bold text-white bg-purple-500 rounded-2xl shadow-lg"
      >
        My Profile
      </button>
    </div>
  );
}
