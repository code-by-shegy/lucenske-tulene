// utils/points.ts
export function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

/**
 * Fair points formula tuned for:
 *  - Tw (water): -2 .. 20 °C (colder -> higher score, linear effect)
 *  - Ta (air): -30 .. 30 °C (small effect)
 *  - c (weather): integer 0..3 (small impact)
 *  - t (time): minutes, typical 0..20, extreme 30
 *
 * Returns a positive number; tune BASE_POINTS, TIME_MULT_AT_20, and scalars below.
 */
export function calculatePointsFair(
  Tw: number, // water °C
  Ta: number, // air °C
  c: number, // weather factor (0..3)
  t: number, // time in minutes
): number {
  // --- clamp inputs to expected ranges (protect against strange input) ---
  const TwClamped = clamp(Tw, -2, 20);
  const TaClamped = clamp(Ta, -30, 30);
  const cClamped = clamp(Math.round(c), 0, 3);
  const tClamped = clamp(t, 0, 30); // allow extreme 30min, but clamp

  // --- Tunable knobs ---
  const BASE_POINTS = 10.0; // overall scale (change this if numbers too big/small)
  const WATER_SCALE = 1.0; // how strongly water temp moves base (1.0 => base in [1..2])
  const WEATHER_IMPACT = 0.05; // per weather-step (0.05 => up to +15% for c=3)
  const DIFF_IMPACT = 0.05; // max +/- impact from (Ta - Tw) normalized
  const DIFF_NORMALIZER = 50.0; // scale denominator for Ta-Tw -> keeps effect small
  const TIME_MULT_AT_20 = 10.0; // how many times bigger points at 20min vs 0min (exponential target)

  // --- Water linear factor (colder => higher) ---
  // Tw ∈ [-2,20] -> (20 - Tw) ∈ [0,22]
  const waterLinear = 1 + (WATER_SCALE * (20 - TwClamped)) / 22; // range approx [1, 1 + WATER_SCALE]

  // --- Weather tiny multiplier ---
  const weatherFactor = 1 + WEATHER_IMPACT * cClamped; // 1 .. 1 + 0.05*c

  // --- Air vs water difference: small effect, clamp to [-1,1] ---
  const diffNorm = clamp((TaClamped - TwClamped) / DIFF_NORMALIZER, -1, 1);
  // if air warmer (positive diff), reduce slightly; if air colder, increase slightly
  const diffFactor = 1 - DIFF_IMPACT * diffNorm;

  // --- Time exponential factor ---
  // Choose k so exp(k * 20) = TIME_MULT_AT_20  => k = ln(TIME_MULT_AT_20) / 20
  const k = Math.log(TIME_MULT_AT_20) / 20;
  const timeFactor = Math.exp(k * tClamped); // exponential growth in minutes

  // --- Compose final score ---
  const raw =
    BASE_POINTS * waterLinear * weatherFactor * diffFactor * timeFactor;

  // Optionally clamp final value to avoid huge outliers:
  const MAX_POINTS = 20000; // adjustable
  const points = clamp(raw, 0, MAX_POINTS);

  return points;
}
