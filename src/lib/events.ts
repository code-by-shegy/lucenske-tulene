import { createEvent, getEventsByUser } from "./db";

// Re-export user-related db functions, keeping same names
// Makes the app code cleaner (import from ./users instead of ./db)

export { createEvent, getEventsByUser };