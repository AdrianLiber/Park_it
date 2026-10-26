import { MISS_SCORE } from "../shared/scoring.js";

const MISS_MARKERS = ["#", "*"];

const hasMissMarker = (text) => MISS_MARKERS.some((marker) => text.includes(marker));

const toNumber = (text) => Number(text.replace(",", "."));

/**
 * Reads one disc's input.
 *   "45" → 45, "#" → 300, "350" → 300 (capped), "" → null (empty), "abc" → NaN (invalid)
 */
export function parseThrow(rawInput) {
  const text = String(rawInput).trim();
  if (!text) return null;
  if (hasMissMarker(text)) return MISS_SCORE;

  const distance = toNumber(text);
  if (!Number.isFinite(distance) || distance < 0) return NaN;
  return Math.min(MISS_SCORE, Math.round(distance));
}

/** Hint shown under a disc input, e.g. "= 45 cm" or "= 300 miss". */
export function describeThrow(rawInput, distance) {
  const text = String(rawInput).trim();
  const isMiss = distance === MISS_SCORE && (hasMissMarker(text) || toNumber(text) > MISS_SCORE);
  return isMiss ? `= ${MISS_SCORE} miss` : `= ${distance} cm`;
}

export function isValidThrow(distance) {
  return distance !== null && !Number.isNaN(distance);
}
