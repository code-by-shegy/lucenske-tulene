// src/pages/StartSession.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Page from "../components/Page";
import Button from "../components/Button";
import Input from "../components/Input";
import { createEvent } from "../lib/events";
import { auth } from "../firebase";

export default function StartSession() {
  const navigate = useNavigate();

  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [water_temp_string, setWaterTemp] = useState<string>("");
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
    const tempNum = parseFloat(water_temp_string);
    if (!isNaN(tempNum) && tempNum > 0) {
      setPoints(Math.round((time / tempNum) * 100) / 100);
    } else {
      setPoints(0);
    }
  }, [time, water_temp_string]);

  const displayName =
    auth.currentUser?.displayName ??
    (auth.currentUser?.email ? auth.currentUser.email.split("@")[0] : "Your");

  const handleMainButton = async () => {
    // ⚠️ logic untouched
    if (stage === "start") {
      if (
        !water_temp_string ||
        isNaN(parseFloat(water_temp_string)) ||
        parseFloat(water_temp_string) <= 0
      ) {
        alert("Zadaj teplotu vody ty primitív.");
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
      const water_temp_num = parseFloat(water_temp_string);
      const time_in_water = time;
      const points =
        Math.round((time_in_water / (water_temp_num || 1)) * 100) / 100;

      try {
        await createEvent(
          uid,
          date,
          water_temp_num,
          time_in_water,
          points,
          null
        );

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
    <Page>
      <Header title={`${displayName} otužuje`} onBack={() => navigate("/")} />

      {/* Timer */}
      <div className="flex-1 flex items-center justify-center  bg-lightgrey">
        <div className="text-6xl font-bangers text-darkblack">
          {String(Math.floor(time / 60)).padStart(2, "0")}:
          {String(time % 60).padStart(2, "0")}
        </div>
      </div>

      {/* Main button */}
      <div className="p-4 bg-lightgrey">
        <Button
          fullWidth
          size="lg"
          variant={stage === "stop" ? "danger" : "primary"}
          onClick={handleMainButton}
          disabled={loading}
        >
          {loading && stage === "save"
            ? "Silné!"
            : stage === "start"
            ? "Štart"
            : stage === "stop"
            ? "Stop"
            : "Uložiť"}
        </Button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4 px-6 pb-8 bg-lightgrey">
        <div className="w-full">
          <Input
            label="Teplota vody (°C)"
            type="number"
            step="0.1"
            value={water_temp_string}
            onChange={(e) => setWaterTemp(e.target.value)}
            disabled={stage !== "start"}
            placeholder="e.g. 4"
          />
        </div>

        <div className="w-full">
          <Input label="Body" value={String(points)} readOnly />
        </div>
      </div>
    </Page>
  );
}