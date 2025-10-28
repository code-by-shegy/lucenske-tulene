// src/lib/location.ts
import { GeoPoint } from "firebase/firestore";

/**
 * Attempts to get the user's current GPS location.
 * Returns a Firestore GeoPoint if successful, or null if denied/unavailable.
 */
export async function getCurrentGeoPoint(): Promise<GeoPoint | null> {
  if (!("geolocation" in navigator)) {
    console.warn("Geolocation not supported by this browser.");
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }),
    );

    const { latitude, longitude } = position.coords;
    return new GeoPoint(latitude, longitude);
  } catch (error: any) {
    console.warn("Failed to get GPS location:", error);
    return null;
  }
}
