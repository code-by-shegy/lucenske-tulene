// src/pages/StartSession.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../lib/db_events";
import { auth } from "../firebase";
import { RotateCcw } from "lucide-react"; // add this at the top with other imports

import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

import iconWaterTemp from "../assets/icons/water_temp.svg";
import iconAirTemp from "../assets/icons/air_temp.svg";
import iconSunny from "../assets/icons/sunny.svg";
import iconCloudy from "../assets/icons/cloudy.svg";
import iconSnowing from "../assets/icons/snowing.svg";
import iconRaining from "../assets/icons/raining.svg";
import iconTimer from "../assets/icons/timer.svg";

import type { Weather, TimeInSeconds, Points, EventType } from "../types";

export default function StartSession() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Preload gong sound
  const [gong, setGong] = useState<HTMLAudioElement | null>(null);

  const [prepTime, setPrepTime] = useState<TimeInSeconds>(30); // 10, 20, or 30
  const [prepRemaining, setPrepRemaining] = useState<TimeInSeconds>(0);
  const [inPrep, setInPrep] = useState<boolean>(false);

  // const [current_time, setCurrentTime] = useState<TimeInSeconds>(0);
  // const [running, setRunning] = useState<boolean>(false);
  const [current_time, setCurrentTime] = useState<TimeInSeconds>(0);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null); // new

  /*must be string for the input to work nicely*/
  const [water_temp, setWaterTemp] = useState<string>("");
  const [air_temp, setAirTemp] = useState<string>("");
  const [weather, setWeather] = useState<Weather>(0);

  // Convert to numbers safely
  const water_temp_num = water_temp === "" ? 100 : parseFloat(water_temp);
  const air_temp_num = air_temp === "" ? 100 : parseFloat(air_temp);

  const [points, setPoints] = useState<Points>(0);
  const [stage, setStage] = useState<"start" | "stop" | "save">("start");
  const [loading, setLoading] = useState<boolean>(false);

  const weatherOptions = [
    { value: 0, label: "Vyber počasie" },
    { value: 1, label: "Slnečno" },
    { value: 2, label: "Oblačno" },
    { value: 3, label: "Prší" },
    { value: 4, label: "Sneží" },
  ];

  const weatherIcons: Record<number, string> = {
    1: iconSunny,
    2: iconCloudy,
    3: iconRaining,
    4: iconSnowing,
  };

  const canStart =
    water_temp !== "" &&
    air_temp !== "" &&
    !isNaN(water_temp_num) &&
    !isNaN(air_temp_num) &&
    weather !== 0 &&
    prepTime !== 0;

  const readonlyInputs = inPrep || startTimestamp !== null || stage !== "start";
  const animationFrameRef = useRef<number | null>(null);
  const event_type: EventType = "cold_plunge";

  useEffect(() => {
    const audio = new Audio("/gong.mp3");
    audio.preload = "auto";
    setGong(audio);
  }, []);

  const playBell = () => {
    if (!gong) return; // not loaded yet
    try {
      gong.currentTime = 0;
      gong.play().catch((err) => {
        console.warn("Audio play blocked or failed:", err);
      });
    } catch (err) {
      console.error("Error playing gong:", err);
    }
  };

  function calculatePoints(): number {
    const Tw = Number(water_temp_num); // water temperature
    const Ta = Number(air_temp_num); // air temperature
    const c = Number(weather); // weather factor
    const t = Number(current_time / 60); // time in minutes

    const base = 20 - Tw + c;
    const exponent = 1 + t / (20 + Tw + (Ta - Tw) / 10);

    if (base <= 0) return 0; // prevent negative/zero base issues
    const P = Math.pow(base, exponent);

    //return Math.round(P); // rounds to nearest integer
    return P; // rounds to nearest integer
  }

  useEffect(() => {
    if (inPrep && prepRemaining > 0) {
      const id = setInterval(() => setPrepRemaining((t) => t - 1), 1000);
      return () => clearInterval(id);
    }

    if (inPrep && prepRemaining === 0) {
      setInPrep(false);
      playBell();
      setStartTimestamp(Date.now());
      setStage("stop");
    }
  }, [inPrep, prepRemaining]);

  useEffect(() => {
    // Only run timer if session started and stage is "stop"
    if (!startTimestamp || stage !== "stop") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const update = () => {
      setCurrentTime(Math.floor((Date.now() - startTimestamp) / 1000));
      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [startTimestamp, stage]);

  useEffect(() => {
    if (
      water_temp !== "" &&
      air_temp !== "" &&
      !isNaN(water_temp_num) &&
      !isNaN(air_temp_num) &&
      !isNaN(weather)
    ) {
      setPoints(parseFloat(calculatePoints().toFixed(1)));
    } else {
      setPoints(0);
    }
  }, [current_time]);

  const handleMainButton = async () => {
    if (stage === "start") {
      if (!water_temp || isNaN(water_temp_num)) {
        alert("Zadaj teplotu vody ty primitív.");
        return;
      }
      if (!air_temp || isNaN(air_temp_num)) {
        alert("Zadaj teplotu vzduchu ty primitív.");
        return;
      }
      if (!weather || isNaN(weather)) {
        alert("Vyber počasie ty primitív.");
        return;
      }

      // Start pre-timer
      setPrepRemaining(prepTime);
      setInPrep(true);
      return;
    }

    if (stage === "stop") {
      setStage("save");
      return;
    }

    if (stage === "save") {
      setLoading(true);
      if (!user) {
        alert("You must be logged in to save a session.");
        navigate("/login");
        setLoading(false);
        return;
      }

      const date = new Date();
      const time_in_water = current_time;

      try {
        await createEvent(
          user.uid,
          date,
          water_temp_num ?? 100,
          air_temp_num ?? 100,
          weather ?? 0,
          time_in_water ?? 0,
          points ?? 0,
          null, //photo url
          event_type,
          null, //location
          null, //title
        );

        setCurrentTime(0);
        setPoints(0);
        setWaterTemp("");
        setAirTemp("");
        setWeather(0);
        setStage("start");

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
    <>
      {/* Timer */}
      <div className="mt-4 flex justify-center">
        <div className="font-bangers text-darkblack text-8xl leading-none tracking-tight tabular-nums">
          {inPrep
            ? `${String(prepRemaining).padStart(2, "0")}`
            : `${String(Math.floor(current_time / 60)).padStart(2, "0")}:${String(current_time % 60).padStart(2, "0")}`}
        </div>
      </div>

      {/* Main + Reset buttons */}
      <div className="flex gap-4">
        <Button
          className="flex-[9]"
          size="lg"
          variant={stage === "stop" ? "danger" : "primary"}
          onClick={handleMainButton}
          disabled={loading || inPrep || !canStart}
        >
          {inPrep
            ? `Odpočítavanie`
            : loading && stage === "save"
              ? "Silné!"
              : stage === "start"
                ? "Štart"
                : stage === "stop"
                  ? "Stop"
                  : "Uložiť"}
        </Button>

        <Button
          className="flex-[1]"
          size="lg"
          variant="secondary"
          onClick={() => {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
              animationFrameRef.current = null;
            }
            setCurrentTime(0);
            setPoints(0);
            setStage("start");
            setInPrep(false);
            setPrepRemaining(0);
            setStartTimestamp(null);
          }}
          iconOnly
        >
          <RotateCcw strokeWidth={3} />
        </Button>
      </div>
      {/* Inputs */}
      <Card className="mb-4 grid grid-cols-1 gap-3">
        <Input
          type="number"
          step="0.1"
          value={water_temp}
          onChange={(e) => setWaterTemp(e.target.value)}
          disabled={readonlyInputs}
          placeholder="Teplota vody (°C)"
          icon={iconWaterTemp}
          inputClassName="pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer"
        />

        <Input
          type="number"
          step="0.1"
          value={air_temp}
          onChange={(e) => setAirTemp(e.target.value)}
          disabled={readonlyInputs}
          placeholder="Teplota vzduchu (°C)"
          icon={iconAirTemp}
          iconClassName="h-[100%]"
          inputClassName="pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer"
        />

        <Select
          value={weather}
          onChange={(e) => setWeather(Number(e.target.value))}
          disabled={readonlyInputs}
          options={weatherOptions}
          icon={weatherIcons[weather] || iconSunny}
          selectClassName="pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer"
        />

        <Select
          value={prepTime}
          onChange={(e) => setPrepTime(Number(e.target.value))}
          disabled={readonlyInputs}
          options={[
            { value: 10, label: "10 sekúnd" },
            { value: 20, label: "20 sekúnd" },
            { value: 30, label: "30 sekúnd" },
          ]}
          icon={iconTimer}
          selectClassName="pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer"
        />
      </Card>
    </>
  );
}
