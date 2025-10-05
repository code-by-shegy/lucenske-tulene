// src/pages/StartSession.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../lib/events";
import { auth } from "../firebase";
import { getUser } from "../lib/users";
import { RotateCcw } from "lucide-react"; // add this at the top with other imports

import Header from "../components/Header";
import Page from "../components/Page";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

import type { Weather, UserName, TimeInSeconds, Points } from "../types";

export default function StartSession() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Preload gong sound
  const [gong, setGong] = useState<HTMLAudioElement | null>(null);

  const [prepTime, setPrepTime] = useState<TimeInSeconds>(30); // 10, 20, or 30
  const [prepRemaining, setPrepRemaining] = useState<TimeInSeconds>(0);
  const [inPrep, setInPrep] = useState<boolean>(false);

  const [user_name, setName] = useState<UserName>("");
  const [current_time, setCurrentTime] = useState<TimeInSeconds>(0);
  const [running, setRunning] = useState<boolean>(false);

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
    { value: 3, label: "Sneží/Prší" },
  ];

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

  function calculatePoints(): Points {
    const tw = Number(water_temp_num);
    const ta = Number(air_temp_num);
    const w = Number(weather);
    const sign = (x: number) => (x > 0 ? 1 : x < 0 ? -1 : 0);
    const numerator =
      (30 - tw) * (current_time / 60) + (tw - ta) / (50 - 10 * w);
    const denominator = 1 + (tw * sign(tw)) / 5;
    if (denominator === 0 || !isFinite(numerator / denominator)) return 0;
    return numerator / denominator;
  }

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;

      try {
        const user_profile = await getUser(user.uid);
        if (user_profile?.user_name) {
          setName(user_profile.user_name);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setName("Tuleň"); // fallback
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    if (inPrep && prepRemaining > 0) {
      const id = setInterval(() => setPrepRemaining((t) => t - 1), 1000);
      return () => clearInterval(id);
    }

    if (inPrep && prepRemaining === 0) {
      setInPrep(false);
      playBell();
      setRunning(true); // start real session
      setStage("stop");
    }
  }, [inPrep, prepRemaining]);

  useEffect(() => {
    //stopwatch ticking refresh every one second
    let id: number | undefined;
    if (running) {
      id = window.setInterval(() => setCurrentTime((t) => t + 1), 1000);
    }
    return () => {
      if (id !== undefined) window.clearInterval(id);
    };
  }, [running]);

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
      setRunning(false);
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
          null,
        );

        setCurrentTime(0);
        setPoints(0);
        setWaterTemp("");
        setAirTemp("");
        setWeather(0);
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
    <Page className="pb-[10vh]">
      {/*So the bottom navbar does not cover content*/}
      <Header title={`${user_name} otužuje`} />

      {/* Timer */}
      <div className="bg-lightgrey flex flex-1 items-center justify-center">
        <div className="font-bangers text-darkblack text-7xl sm:text-8xl md:text-9xl lg:text-[12rem]">
          {inPrep
            ? `${prepRemaining}`
            : `${String(Math.floor(current_time / 60)).padStart(2, "0")}:${String(current_time % 60).padStart(2, "0")}`}
        </div>
      </div>

      {/* Main + Reset buttons */}
      <div className="flex gap-2 p-4">
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
          onClick={() => {
            setCurrentTime(0);
            setPoints(0);
            setRunning(false);
            setStage("start");
            setInPrep(false);
            setPrepRemaining(0);
          }}
          iconOnly
        >
          <RotateCcw strokeWidth={3} />
        </Button>
      </div>

      {/* Inputs */}
      <Card className="grid grid-cols-1 gap-1">
        <Input
          label="Teplota vody (°C)"
          type="decimal"
          step="0.1"
          value={water_temp}
          onChange={(e) => setWaterTemp(e.target.value)}
          disabled={stage !== "start"}
          placeholder=""
        />

        <Input
          label="Teplota vzduchu (°C)"
          type="decimal"
          step="0.1"
          value={air_temp}
          onChange={(e) => setAirTemp(e.target.value)}
          disabled={stage !== "start"}
          placeholder=""
        />

        <Select
          className="mt-auto"
          label="Počasie"
          value={weather}
          onChange={(e) => setWeather(Number(e.target.value))}
          disabled={stage !== "start"}
          options={weatherOptions}
        />

        <Select
          label="Prípravný čas"
          value={prepTime}
          onChange={(e) => setPrepTime(Number(e.target.value))}
          disabled={stage !== "start"}
          options={[
            { value: 10, label: "10 sekúnd" },
            { value: 20, label: "20 sekúnd" },
            { value: 30, label: "30 sekúnd" },
          ]}
        />

        <Input label="Body" value={points.toFixed(1)} readOnly />
      </Card>
    </Page>
  );
}
