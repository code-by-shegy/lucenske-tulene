import { GeoPoint } from "firebase/firestore";

export type EventId = string;
export type EventsCount = number;
export type EventType = "cold_plunge" | "cold_shower" | null;
export type Location = GeoPoint | null;

export type UserId = string;
export type UserName = string;
export type Email = string;
export type Title = string | null;

export type Url = string | null;
export type Points = number;
export type Standing = number | null;
export type Weather = number;
export type TempCelsius = number;
export type TimeInSeconds = number;

// Event
export type EventEntry = {
  event_id: EventId;
  user_id: UserId;
  date: Date | null;
  water_temp: TempCelsius;
  air_temp: TempCelsius;
  weather: Weather;
  time_in_water: TimeInSeconds;
  points: Points;
  photo_url: Url;
  event_type: EventType;
  location: Location;
  title: Title;
};

// User profile
export type UserProfile = {
  user_name: UserName;
  email: Email;
  avatar_url: Url;
  events_count: EventsCount;
  showers_count: EventsCount;
  points: Points;
  approved: boolean;
};

// Leaderboard
export type LeaderboardEntry = {
  user_id: UserId;
  user_name: UserName;
  showers_count: EventsCount;
  events_count: EventsCount;
  points: Points;
};
