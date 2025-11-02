// Icons
import iconWaterTempCompact from "./assets/icons/water_temp_compact.svg";
import iconAirTempCompact from "./assets/icons/air_temp_compact.svg";
import iconTimerCompact from "./assets/icons/timer_compact.svg";
import iconStopwatchCompact from "./assets/icons/stopwatch_compact.svg";
import iconSunnyCompact from "./assets/icons/sunny_compact.svg";
import iconCloudyCompact from "./assets/icons/cloudy_compact.svg";
import iconSnowingCompact from "./assets/icons/snowing_compact.svg";
import iconRainingCompact from "./assets/icons/raining_compact.svg";
import iconSealCompact from "./assets/icons/seal_compact.svg";
import iconSealPointsCompact from "./assets/icons/points_compact.svg";
import iconColdPlungeCompact from "./assets/icons/cold_exposure_compact.svg";
import iconColdShowerCompact from "./assets/icons/cold_shower_compact.svg";
import iconCalendarCompact from "./assets/icons/calendar_compact.svg";
import iconLeaderboardCompact from "./assets/icons/leaderboard_compact.svg";

export const ICONS = {
  compact: {
    waterTemp: iconWaterTempCompact,
    airTemp: iconAirTempCompact,
    timer: iconTimerCompact,
    weather: {
      sunny: iconSunnyCompact,
      cloudy: iconCloudyCompact,
      snowing: iconSnowingCompact,
      raining: iconRainingCompact,
    },
    seal: iconSealCompact,
    sealPoints: iconSealPointsCompact,
    stopwatch: iconStopwatchCompact,
    coldPlunge: iconColdPlungeCompact,
    coldShower: iconColdShowerCompact,
    calendar: iconCalendarCompact,
    leaderboard: iconLeaderboardCompact,
  },
  padded: {
    waterTemp: iconWaterTempCompact,
    airTemp: iconAirTempCompact,
    timer: iconTimerCompact,
    weather: {
      sunny: iconSunnyCompact,
      cloudy: iconCloudyCompact,
      snowing: iconSnowingCompact,
      raining: iconRainingCompact,
    },
    seal: iconSealCompact,
    sealPoints: iconSealPointsCompact,
    stopwatch: iconStopwatchCompact,
    coldPlunge: iconColdPlungeCompact,
    coldShower: iconColdShowerCompact,
    calendar: iconCalendarCompact,
    leaderboard: iconLeaderboardCompact,
  },
};

// Temperature
export const WATER_TEMP_MIN = -3;
export const WATER_TEMP_MAX = 20;

export const AIR_TEMP_MIN = -30;
export const AIR_TEMP_MAX = 30;

// Weather
export const WEATHER = {
  NONE: 0,
  SUNNY: 1,
  CLOUDY: 2,
  RAIN: 3,
  SNOW: 3.1,
} as const;

export const WEATHER_OPTIONS = [
  { value: WEATHER.NONE, label: "Počasie" },
  { value: WEATHER.SUNNY, label: "Slnečno" },
  { value: WEATHER.CLOUDY, label: "Oblačno" },
  { value: WEATHER.RAIN, label: "Prší" },
  { value: WEATHER.SNOW, label: "Sneží" },
];

export const WEATHER_ICON_MAP: Record<number, string> = {
  [WEATHER.NONE]: iconSunnyCompact,
  [WEATHER.SUNNY]: iconSunnyCompact,
  [WEATHER.CLOUDY]: iconCloudyCompact,
  [WEATHER.RAIN]: iconRainingCompact,
  [WEATHER.SNOW]: iconSnowingCompact,
};

// Timer
export const TIMER_OPTIONS = [
  { value: 0, label: "Časovač" },
  { value: 10, label: "10 sekúnd" },
  { value: 20, label: "20 sekúnd" },
  { value: 30, label: "30 sekúnd" },
];

// Events
export const EVENT_TYPE = {
  COLD_PLUNGE: "cold_plunge",
  COLD_SHOWER: "cold_shower",
} as const;

// Shower
export const SHOWER_OPTIONS = [
  { value: 0, label: "Vyber trvanie sprchy" },
  { value: 60, label: "1 minúta" },
  { value: 120, label: "2 minúty" },
];
