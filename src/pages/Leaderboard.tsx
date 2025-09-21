import React from "react";
import { useNavigate } from "react-router-dom";

export default function Leaderboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="flex items-center gap-3 p-4 bg-white shadow">
        <button
          onClick={() => navigate("/")}
          aria-label="Back to home"
          className="w-10 h-10 flex items-center justify-center rounded-md bg-white border shadow-sm"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">Leaderboard</h1>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <h2 className="text-xl font-medium">Leaderboard list will be shown here</h2>
      </main>
    </div>
  );
}
