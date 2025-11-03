// src/pages/ColdShower.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import { ICONS, SHOWER_OPTIONS, EVENT_TYPE } from "../constants";
import { createEvent } from "../lib/db_events";
import { getCurrentGeoPoint } from "../lib/db_location";

import Card from "../components/Card";
import Button from "../components/Button";
import Select from "../components/Select";

import type { Points, EventType } from "../types";

const event_type: EventType = EVENT_TYPE.COLD_SHOWER;
const pointsMap: Record<number, Points> = {
  60: 1,
  120: 2,
};

// ==============================
// Main component
// ==============================

export default function ColdShower() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [duration, setDuration] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [missingFields, setMissingFields] = useState({ duration: false });

  // ==============================
  // Sound - Gong
  // ==============================

  const [gong, setGong] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/gong.mp3");
    audio.preload = "auto";
    setGong(audio);
  }, []);

  const playBell = () => {
    if (!gong) return;
    try {
      gong.currentTime = 0;
      gong.play();
    } catch (_) {
      // catch err silently
    }
  };

  // ==============================
  // Timer
  // ==============================

  useEffect(() => {
    if (!running || !startTimestamp) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const update = () => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
      const newRemaining = Math.max(duration - elapsed, 0);
      setRemaining(newRemaining);

      if (newRemaining <= 0) {
        setRunning(false);
        setFinished(true);
        playBell();
        setStartTimestamp(null);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        return;
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [running, startTimestamp, duration]);

  // ==============================
  // Handlers
  // ==============================

  const handleStart = () => {
    if (!duration || duration <= 0) {
      setMissingFields({ duration: true });
      return;
    }
    setMissingFields({ duration: false });
    setRemaining(duration);
    setStartTimestamp(Date.now());
    setRunning(true);
    setFinished(false);
  };

  const handleReset = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setRunning(false);
    setFinished(false);
    setRemaining(0);
    setDuration(0);
    setStartTimestamp(null);
    setMissingFields({ duration: false });
  };

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
      const geoPoint = await getCurrentGeoPoint();
      await createEvent(
        user.uid,
        date,
        15, // water temp (placeholder)
        23, // air temp
        0, // weather
        time_in_water,
        points,
        null, // photo url
        event_type,
        geoPoint,
        null, // title
      );
      navigate("/leaderboard");
    } catch (error: any) {
      console.warn("GPS failed or denied, saving without location:", error);

      // fallback: save event without location
      await createEvent(
        user.uid,
        date,
        15, // water temp (placeholder)
        23, // air temp
        0, // weather
        time_in_water,
        points,
        null, // photo url
        event_type,
        null, // ❌ no location
        null,
      );
      navigate("/leaderboard");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // JSX
  // ==============================

  return (
    <>
      {/* Timer display */}
      <div className="mt-4 flex justify-center">
        <div className="text-darkblack text-8xl leading-none font-extrabold tracking-tight tabular-nums">
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
            variant={"primary"}
            onClick={running ? handleReset : handleStart}
            disabled={loading || running}
          >
            {running ? "Odpočítavanie" : "Štart"}
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
          disabled={finished}
        >
          <RotateCcw strokeWidth={3} />
        </Button>
      </div>

      {/* Options */}
      <Card className="mb-4 grid grid-cols-1 gap-3">
        <Select
          value={duration}
          onChange={(e) => {
            setDuration(Number(e.target.value));
            setMissingFields({ duration: false });
          }}
          disabled={running || finished}
          options={SHOWER_OPTIONS}
          icon={ICONS.compact.timer}
          selectClassName={`pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer ${
            missingFields.duration ? "border-2 border-red-500" : ""
          }`}
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
