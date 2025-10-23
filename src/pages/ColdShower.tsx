import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../lib/db_events";
import { auth } from "../firebase";
import { RotateCcw } from "lucide-react";

import Card from "../components/Card";
import Button from "../components/Button";
import Select from "../components/Select";

import iconTimer from "../assets/icons/timer.svg";

import type { Points, EventType } from "../types";

export default function ColdShower() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [gong, setGong] = useState<HTMLAudioElement | null>(null);

  const [duration, setDuration] = useState<number>(0); // selected duration in seconds
  const [remaining, setRemaining] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Map durations to points
  const pointsMap: Record<number, Points> = {
    60: 1,
    120: 2,
  };

  const options = [
    { value: 0, label: "Vyber trvanie sprchy" },
    { value: 60, label: "1 minúta" },
    { value: 120, label: "2 minúty" },
  ];

  const event_type: EventType = "cold_shower";

  // Preload gong
  useEffect(() => {
    const audio = new Audio("/gong.mp3");
    audio.preload = "auto";
    setGong(audio);
  }, []);

  const playBell = () => {
    if (!gong) return;
    try {
      gong.currentTime = 0;
      gong
        .play()
        .catch((err) => console.warn("Audio play blocked or failed:", err));
    } catch (err) {
      console.error("Error playing gong:", err);
    }
  };

  const handleStart = () => {
    if (!duration || duration <= 0) {
      alert("Vyber dĺžku sprchy tuleň!");
      return;
    }
    setRemaining(duration);
    setRunning(true);
    setFinished(false);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setFinished(false);
    setRemaining(0);
    setDuration(0);
  };

  // Timer logic
  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current!);
          setRunning(false);
          setFinished(true);
          playBell();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  const handleSave = async () => {
    if (!user) {
      alert("Musíš byť prihlásený aby si mohol uložiť sprchu.");
      navigate("/login");
      return;
    }

    const date = new Date();
    const time_in_water = duration;
    const points = pointsMap[duration] ?? 0;

    try {
      setLoading(true);
      await createEvent(
        user.uid,
        date,
        15, // water temp (not relevant)
        23, // air temp
        0, // weather
        time_in_water,
        points,
        null, //photo url
        event_type,
        null, //location
        null, //title
      );
      navigate("/leaderboard");
    } catch (err: any) {
      console.error("Failed to save cold shower:", err);
      alert("Nepodarilo sa uložiť sprchu: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Timer display */}
      <div className="mt-4 flex justify-center">
        <div className="font-bangers text-darkblack text-8xl leading-none tracking-tight tabular-nums">
          {String(Math.floor(remaining / 60)).padStart(2, "0")}:
          {String(remaining % 60).padStart(2, "0")}
        </div>
      </div>

      {/* Main controls */}
      <div className="flex gap-4">
        {!finished ? (
          <Button
            className="flex-[9]"
            size="lg"
            variant={running ? "danger" : "primary"}
            onClick={running ? handleReset : handleStart}
            disabled={loading || (running ? false : !duration)}
          >
            {running ? "Stop" : "Štart"}
          </Button>
        ) : (
          <Button
            className="flex-[9]"
            size="lg"
            variant="primary"
            onClick={handleSave}
            disabled={loading}
          >
            Uložiť
          </Button>
        )}

        <Button
          className="flex-[1]"
          size="lg"
          variant="secondary"
          onClick={handleReset}
          iconOnly
        >
          <RotateCcw strokeWidth={3} />
        </Button>
      </div>
      {/* Options */}
      <Card className="mb-4 grid grid-cols-1 gap-3">
        <Select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          disabled={running || finished}
          options={options}
          icon={iconTimer}
          selectClassName="pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer"
        />

        <div className="text-darkblack font-bangers p-1 text-center text-2xl">
          {duration > 0 && (
            <>
              Body:{" "}
              <span className="text-mediumblue">{pointsMap[duration]}</span>
            </>
          )}
        </div>
      </Card>
    </>
  );
}
