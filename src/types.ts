export type EventId = string;
export type UserId = string;
export type UserName = string;
export type Email = string;
export type Url = string | null;
export type Points = number;
export type EventsCount = number;
export type Standing = number | null;
export type WaterTempCelsius = number;
export type TimeInSeconds = number;

// Event
export type EventEntry = {
  event_id: EventId;
  user_id: UserId;
  date: Date; // normalized to JS Date (instead of raw Firestore Timestamp)
  water_temp: WaterTempCelsius;
  time_in_water: TimeInSeconds;
  points: Points;
  photo_url: Url;
};

// User profile
export type UserProfile = {
  user_id: UserId;
  user_name: UserName;
  email: Email;
  avatar_url: Url;
  events_count: EventsCount;
  points: Points;
  standing: Standing;
};

// Leaderboard
export type LeaderboardEntry = {
  user_id: UserId;
  user_name: UserName;
  events_count: EventsCount;
  points: Points;
};