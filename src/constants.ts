// Icons
import iconWaterTemp from "./assets/icons/water_temp.svg";
import iconAirTemp from "./assets/icons/air_temp.svg";
import iconTimer from "./assets/icons/timer.svg";
import iconSunny from "./assets/icons/sunny.svg";
import iconCloudy from "./assets/icons/cloudy.svg";
import iconSnowing from "./assets/icons/snowing.svg";
import iconRaining from "./assets/icons/raining.svg";

export const ICONS = {
  waterTemp: iconWaterTemp,
  airTemp: iconAirTemp,
  timer: iconTimer,
  weather: {
    sunny: iconSunny,
    cloudy: iconCloudy,
    snowing: iconSnowing,
    raining: iconRaining,
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
  SNOW: 4,
} as const;

export const WEATHER_OPTIONS = [
  { value: WEATHER.NONE, label: "Počasie" },
  { value: WEATHER.SUNNY, label: "Slnečno" },
  { value: WEATHER.CLOUDY, label: "Oblačno" },
  { value: WEATHER.RAIN, label: "Prší" },
  { value: WEATHER.SNOW, label: "Sneží" },
];

export const WEATHER_ICON_MAP: Record<number, string> = {
  [WEATHER.NONE]: iconSunny,
  [WEATHER.SUNNY]: iconSunny,
  [WEATHER.CLOUDY]: iconCloudy,
  [WEATHER.RAIN]: iconRaining,
  [WEATHER.SNOW]: iconSnowing,
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
