// src/pages/ColdPlunge.tsx
import type { Weather, TimeInSeconds, EventType } from "../types";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getCurrentGeoPoint } from "../lib/db_location";
import { createEvent } from "../lib/db_events";

import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

import {
  AIR_TEMP_MAX,
  AIR_TEMP_MIN,
  EVENT_TYPE,
  ICONS,
  TIMER_OPTIONS,
  WATER_TEMP_MAX,
  WATER_TEMP_MIN,
  WEATHER,
  WEATHER_ICON_MAP,
  WEATHER_OPTIONS,
} from "../constants";

// ==============================
// Constants
// ==============================

const event_type: EventType = EVENT_TYPE.COLD_PLUNGE;
const DEFAULT_WATER_TEMP = 100;
const DEFAULT_AIR_TEMP = 100;

// LocalStorage keys
const LS_PREP_END = "coldplunge_prep_end_ts";
const LS_START_TS = "coldplunge_start_ts";

// ==============================
// Helper functions
// ==============================

function calculatePoints(Tw: number, Ta: number, c: number, t: number): number {
  const base = 20 - Tw + c;
  const exponent = 1 + t / (20 + Tw + (Ta - Tw) / 10);
  if (base <= 0) return 0;
  return Math.pow(base, exponent);
}

function sanitizeTemperatureInput(value: string): string {
  let val = value.replace(",", ".");
  const match = val.match(/^(-?\d{1,2})(\.\d?)?$/);
  if (match) return match[0];
  const truncated = val.replace(/^(-?\d{0,2})(\.\d?)?.*$/, "$1$2");
  return truncated;
}

// ==============================
// Main component
// ==============================

export default function StartSession() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stage, setStage] = useState<"start" | "stop" | "save">("start");
  const [loading, setLoading] = useState<boolean>(false);

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

  // Persisted prepEndTimestamp - rehydrate from localStorage
  const [prepEndTimestamp, setPrepEndTimestamp] = useState<number | null>(
    () => {
      const saved = localStorage.getItem(LS_PREP_END);
      return saved ? Number(saved) : null;
    },
  );

  // Persisted startTimestamp - rehydrate from localStorage
  const [startTimestamp, setStartTimestamp] = useState<number | null>(() => {
    const saved = localStorage.getItem(LS_START_TS);
    return saved ? Number(saved) : null;
  });

  const [inPrep, setInPrep] = useState<boolean>(() => {
    // If there's a future prepEndTimestamp, resume inPrep on mount.
    const saved = localStorage.getItem(LS_PREP_END);
    if (!saved) return false;
    const ts = Number(saved);
    return ts > Date.now();
  });

  const [prepTime, setPrepTime] = useState<TimeInSeconds>(0);
  const [prepRemaining, setPrepRemaining] = useState<TimeInSeconds>(0);

  // Persist prepEndTimestamp to localStorage when it changes
  useEffect(() => {
    if (prepEndTimestamp !== null) {
      localStorage.setItem(LS_PREP_END, String(prepEndTimestamp));
      localStorage.removeItem(LS_PREP_END);
    }
  }, [prepEndTimestamp]);
  // Persist startTimestamp to localStorage when it changes
  useEffect(() => {
    if (startTimestamp !== null) {
      localStorage.setItem(LS_START_TS, String(startTimestamp));
    } else {
      localStorage.removeItem(LS_START_TS);
    }
  }, [startTimestamp]);

  // Animation frame refs for prep and stopwatch
  const prepAnimRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // On mount: if prepEndTimestamp exists, compute prepRemaining or transition to stop
  useEffect(() => {
    if (prepEndTimestamp === null) {
      setPrepRemaining(0);
      return;
    }

    const rem = Math.ceil((prepEndTimestamp - Date.now()) / 1000);
    if (rem <= 0) {
      // prep already finished while app was suspended -> start stopwatch at prepEndTimestamp
      setInPrep(false);
      setPrepRemaining(0);
      // set startTimestamp to the prep end so stopwatch computes from that moment
      setStartTimestamp(prepEndTimestamp);
      setStage("stop");
      // remove persisted prepEndTimestamp because it's consumed
      localStorage.removeItem(LS_PREP_END);
      setPrepEndTimestamp(null);
    } else {
      setPrepRemaining(rem);
      setInPrep(true); // (resume countdown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Prep countdown (requestAnimationFrame loop but based on persisted timestamp)
  useEffect(() => {
    if (!inPrep || prepEndTimestamp === null) {
      if (prepAnimRef.current) {
        cancelAnimationFrame(prepAnimRef.current);
        prepAnimRef.current = null;
      }
      return;
    }

    const update = () => {
      const remaining = Math.ceil((prepEndTimestamp - Date.now()) / 1000);

      if (remaining <= 0) {
        // End of prep period: start stopwatch from exact prepEndTimestamp
        setInPrep(false);
        playBell?.();
        setStartTimestamp(prepEndTimestamp); // start timestamp equals prepEndTimestamp
        setStage("stop");
        setPrepEndTimestamp(null); // this will also remove localStorage via effect
        setPrepRemaining(0);
        if (prepAnimRef.current) {
          cancelAnimationFrame(prepAnimRef.current);
          prepAnimRef.current = null;
        }
        return;
      } else {
        setPrepRemaining(remaining);
      }

      prepAnimRef.current = requestAnimationFrame(update);
    };

    // run first tick immediately to avoid waiting for frame
    update();

    return () => {
      if (prepAnimRef.current) {
        cancelAnimationFrame(prepAnimRef.current);
        prepAnimRef.current = null;
      }
    };
  }, [inPrep, prepEndTimestamp]);

  // ==============================
  // Stopwatch
  // ==============================

  const [current_time, setCurrentTime] = useState<TimeInSeconds>(() => {
    // If we have a startTimestamp on mount, compute elapsed
    const saved = localStorage.getItem(LS_START_TS);
    if (!saved) return 0;
    const st = Number(saved);
    if (st && st <= Date.now()) {
      return Math.floor((Date.now() - st) / 1000);
    }
    return 0;
  });

  useEffect(() => {
    if (!startTimestamp || stage !== "stop") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const update = () => {
      setCurrentTime(
        Math.floor((Date.now() - (startTimestamp as number)) / 1000),
      );
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

  // ==============================
  // Inputs
  // ==============================

  const [water_temp, setWaterTemp] = useState<string>("");
  const [air_temp, setAirTemp] = useState<string>("");
  const [weather, setWeather] = useState<Weather>(WEATHER.NONE);

  const water_temp_num =
    water_temp === "" ? DEFAULT_WATER_TEMP : parseFloat(water_temp);
  const air_temp_num =
    air_temp === "" ? DEFAULT_AIR_TEMP : parseFloat(air_temp);

  const [waterTempError, setWaterTempError] = useState<string | null>(null);
  const [airTempError, setAirTempError] = useState<string | null>(null);

  const readonlyInputs = inPrep || startTimestamp !== null || stage !== "start";

  const [missingFields, setMissingFields] = useState({
    water: false,
    air: false,
    weather: false,
    prep: false,
  });
  // Update points every second
  const displayPoints = (() => {
    if (
      water_temp === "" ||
      air_temp === "" ||
      isNaN(water_temp_num) ||
      isNaN(air_temp_num) ||
      weather === WEATHER.NONE
    )
      return 0;

    const seconds = Math.floor(current_time);
    const p = calculatePoints(
      Number(water_temp_num),
      Number(air_temp_num),
      Number(weather),
      Number(seconds / 60),
    );
    return parseFloat(p.toFixed(1));
  })();

  // ==============================
  // Handlers
  // ==============================

  const resetForm = () => {
    // clear animation frames and persisted timestamps
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (prepAnimRef.current) {
      cancelAnimationFrame(prepAnimRef.current);
      prepAnimRef.current = null;
    }
    localStorage.removeItem(LS_START_TS);
    localStorage.removeItem(LS_PREP_END);

    setInPrep(false);
    setStage("start");
    setWaterTemp("");
    setAirTemp("");
    setWeather(WEATHER.NONE);
    setPrepTime(0);
    setCurrentTime(0);
    setPrepRemaining(0);
    setStartTimestamp(null);
    setPrepEndTimestamp(null);
    setWaterTempError(null);
    setAirTempError(null);
    setMissingFields({ water: false, air: false, weather: false, prep: false });
  };

  //+comment: Replace handleMainButton with this simplified version
  const handleMainButton = async () => {
    if (stage === "start") {
      // simple validation of 4 fields
      const isWater = water_temp !== "" && !isNaN(parseFloat(water_temp));
      const isAir = air_temp !== "" && !isNaN(parseFloat(air_temp));
      const isWeather = weather !== WEATHER.NONE;
      const isPrep = prepTime > 0;

      // highlight missing ones
      setMissingFields({
        water: !isWater,
        air: !isAir,
        weather: !isWeather,
        prep: !isPrep,
      });

      if (!isWater || !isAir || !isWeather || !isPrep) {
        return; // stop here until user fills all fields
      }

      // proceed normally
      const end = Date.now() + prepTime * 1000;
      setPrepRemaining(prepTime);
      setPrepEndTimestamp(end);
      setInPrep(true);
      return;
    }

    if (stage === "stop") {
      setStage("save");
      return;
    }

    if (stage === "save") {
      const finalPoints = calculatePoints(
        Number(water_temp_num),
        Number(air_temp_num),
        Number(weather),
        Number(current_time / 60),
      );
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
        const geoPoint = await getCurrentGeoPoint();
        await createEvent(
          user.uid,
          date,
          water_temp_num ?? 100,
          air_temp_num ?? 100,
          weather ?? WEATHER.NONE,
          time_in_water ?? 0,
          parseFloat(finalPoints.toFixed(1)) ?? 0,
          null,
          event_type,
          geoPoint,
          null,
        );
        resetForm();
        navigate("/leaderboard");
      } catch (error: any) {
        console.warn("GPS failed or denied, saving without location:", error);

        // fallback: save event without location
        await createEvent(
          user.uid,
          date,
          water_temp_num ?? 100,
          air_temp_num ?? 100,
          weather ?? WEATHER.NONE,
          time_in_water ?? 0,
          parseFloat(finalPoints.toFixed(1)) ?? 0,
          null,
          event_type,
          null, // ❌ no location
          null,
        );

        resetForm();
        navigate("/leaderboard");
      } finally {
        setLoading(false);
      }
    }
  };

  // ==============================
  // JSX
  // ==============================

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

      {(stage === "stop" || stage === "save") && (
        <p className="text-darkblack font-bangers -mt-4 -mb-2 p-1 text-center text-2xl">
          Body: <span className="text-mediumblue"> {displayPoints}</span>
        </p>
      )}

      {/* Main + Reset buttons */}
      <div className="flex gap-4">
        <Button
          className="flex-[9]"
          size="lg"
          variant={stage === "stop" ? "danger" : "primary"}
          onClick={handleMainButton}
          disabled={loading || inPrep}
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
          onClick={resetForm}
          iconOnly
        >
          <RotateCcw strokeWidth={3} />
        </Button>
      </div>
      {/* Inputs */}
      <Card className="mb-4 grid grid-cols-1 gap-3">
        <Input
          type="text"
          pattern="-?\d{1,2}(\.\d)?"
          autoCorrect="off"
          spellCheck={false}
          value={water_temp}
          onChange={(e) => {
            const val = sanitizeTemperatureInput(e.target.value);
            setWaterTemp(val);
            setMissingFields((prev) => ({ ...prev, water: false }));
            const num = parseFloat(val);
            if (val === "") {
              setWaterTempError(null);
            } else if (isNaN(num)) {
              setWaterTempError("Pil si? Teplota vody musí byť číšlo.");
            } else if (num < WATER_TEMP_MIN) {
              setWaterTempError("Si normálny? Míňať toľko soli?");
            } else if (num > WATER_TEMP_MAX) {
              setWaterTempError("Táto teplota je pre tuleňa život ohrozujúca!");
            } else {
              setWaterTempError(null);
            }
          }}
          disabled={readonlyInputs}
          placeholder="Teplota vody (°C)"
          icon={ICONS.waterTemp}
          inputClassName={`pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer ${
            missingFields.water ? "border-2 border-red-500" : ""
          }`}
        />

        {waterTempError && (
          <p className="font-roboto ml-2 text-sm font-bold text-red-500">
            {waterTempError}
          </p>
        )}

        <Input
          type="text"
          pattern="-?\d{1,2}(\.\d)?"
          autoCorrect="off"
          spellCheck={false}
          value={air_temp}
          onChange={(e) => {
            const val = sanitizeTemperatureInput(e.target.value);
            setAirTemp(val);
            setMissingFields((prev) => ({ ...prev, air: false }));
            const num = parseFloat(val);
            if (val === "") {
              setAirTempError(null);
            } else if (isNaN(num)) {
              setAirTempError("Pil si? Teplota vzduchu musí byť číšlo.");
            } else if (num < AIR_TEMP_MIN) {
              setAirTempError("Otužovanie v Gulagu je zakázané!");
            } else if (num > AIR_TEMP_MAX) {
              setAirTempError("Táto teplota je pre tuleňa život ohrozujúca!");
            } else {
              setAirTempError(null);
            }
          }}
          disabled={readonlyInputs}
          placeholder="Teplota vzduchu (°C)"
          icon={ICONS.airTemp}
          inputClassName={`pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer ${
            missingFields.air ? "border-2 border-red-500" : ""
          }`}
        />

        {airTempError && (
          <p className="font-roboto ml-2 text-sm font-bold text-red-500">
            {airTempError}
          </p>
        )}

        <Select
          value={weather}
          onChange={(e) => {
            setWeather(Number(e.target.value));
            setMissingFields((prev) => ({ ...prev, weather: false }));
          }}
          disabled={readonlyInputs}
          options={WEATHER_OPTIONS}
          icon={WEATHER_ICON_MAP[weather] ?? WEATHER_ICON_MAP[WEATHER.SUNNY]}
          selectClassName={`pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer ${
            missingFields.weather
              ? "border-2 border-red-500 text-darkgrey"
              : weather === WEATHER.NONE
                ? "text-darkgrey"
                : "text-darkblack"
          }`}
        />

        <Select
          value={prepTime}
          onChange={(e) => {
            setPrepTime(Number(e.target.value));
            setMissingFields((prev) => ({ ...prev, prep: false }));
          }}
          disabled={readonlyInputs}
          options={TIMER_OPTIONS}
          icon={ICONS.timer}
          selectClassName={`pl-20 py-3 rounded-2xl text-lg bg-icywhite cursor-pointer ${
            missingFields.prep
              ? "border-2 border-red-500 text-darkgrey"
              : prepTime === 0
                ? "text-darkgrey"
                : "text-darkblack"
          }`}
        />
      </Card>
    </>
  );
}
