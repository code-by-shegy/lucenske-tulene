// src/pages/StartSession.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { createEvent } from "../lib/events";
import { auth } from "../firebase";

export default function StartSession() {
  const navigate = useNavigate();

  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [waterTemp, setWaterTemp] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [stage, setStage] = useState<"start" | "stop" | "save">("start");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let id: number | undefined;
    if (running) {
      id = window.setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (id !== undefined) window.clearInterval(id);
    };
  }, [running]);

  useEffect(() => {
    const tempNum = parseFloat(waterTemp);
    if (!isNaN(tempNum) && tempNum > 0) {
      setPoints(Math.round((time / tempNum) * 100) / 100);
    } else {
      setPoints(0);
    }
  }, [time, waterTemp]);

  const displayName =
    auth.currentUser?.displayName ??
    (auth.currentUser?.email ? auth.currentUser.email.split("@")[0] : "Your");

  const handleMainButton = async () => {
    if (stage === "start") {
      if (!waterTemp || isNaN(parseFloat(waterTemp)) || parseFloat(waterTemp) <= 0) {
        alert("Please enter a valid water temperature (°C) before starting.");
        return;
      }
      setRunning(true);
      setStage("stop");
      return;
    }

    if (stage === "stop") {
      setRunning(false);
      setStage("save");
      return;
    }

    if (stage === "save") {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to save a session.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const uid = user.uid;
      const date = new Date();
      const water_temp_num = parseFloat(waterTemp);
      const timeInWater = time;
      const pointsNum = Math.round((timeInWater / (water_temp_num || 1)) * 100) / 100;

      try {
        await createEvent(uid, date, water_temp_num, timeInWater, pointsNum, null);

        setTime(0);
        setPoints(0);
        setWaterTemp("");
        setStage("start");
        setRunning(false);

        navigate("/leaderboard");
      } catch (err: any) {
        console.error("Failed to save event:", err);
        alert("Failed to save session: " + (err?.message ?? String(err)));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <Header title={`${displayName}'s session`} onBack={() => navigate("/")} />

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-mono">
            {String(Math.floor(time / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={handleMainButton}
          disabled={loading}
          className={`w-full max-w-lg mx-auto block py-5 rounded-3xl text-xl font-bold text-white shadow-lg ${
            loading
              ? "bg-gray-400 opacity-50 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading && stage === "save" ? "Saving..." : 
            stage === "start" ? "Start" : 
            stage === "stop" ? "Stop" : 
            "Save"}
        </button>
      </div>

      <div className="flex gap-4 px-6 pb-8">
        <div className="flex-1">
          <label className="block text-sm mb-1">Water temp (°C)</label>
          <input
            type="number"
            step="0.1"
            value={waterTemp}
            onChange={(e) => setWaterTemp(e.target.value)}
            disabled={stage !== "start"}
            className="w-full rounded border p-3 text-center"
            placeholder="e.g. 4"
          />
        </div>

        <div className="w-40">
          <label className="block text-sm mb-1">Points</label>
          <input
            type="text"
            value={String(points)}
            readOnly
            className="w-full rounded border p-3 text-center bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}