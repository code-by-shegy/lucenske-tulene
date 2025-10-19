import { useState } from "react";
import Page from "../components/Page";
import Header from "../components/Header";
import ColdPlunge from "./ColdPlunge";
import ColdShower from "./ColdShower";
import Switch from "../components/Switch";
import plungeIcon from "../assets/icons/cold_exposure.svg";
import showerIcon from "../assets/icons/cold_shower.svg";

export default function SessionPage() {
  const [mode, setMode] = useState<"plunge" | "shower">("plunge");

  return (
    <Page className="pb-[10vh]">
      <Header
        title={
          mode === "plunge"
            ? "Otužovanie"
            : mode === "shower"
              ? "Studená sprcha"
              : ""
        }
      />

      <Switch
        className="mt-4"
        mode={mode}
        onChange={setMode}
        icons={{ plunge: plungeIcon, shower: showerIcon }}
      />

      <div className="flex flex-col gap-4">
        {mode === "plunge" ? (
          <ColdPlunge />
        ) : mode === "shower" ? (
          <ColdShower />
        ) : (
          <div>Neznámy režim</div> // fallback
        )}
      </div>
    </Page>
  );
}
