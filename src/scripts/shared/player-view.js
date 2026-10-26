import { createElement } from "./dom.js";
import { MISS_SCORE } from "./scoring.js";

/** English texts. The leaderboard passes translated ones; the scorekeeper page uses these. */
export const DEFAULT_PLAYER_LABELS = {
  miss: "Outside 3 m: 300",
  distance: (distance) => `${distance} cm from the flag`,
  noPdga: "No PDGA #",
};

export function createThrowChip(distance, labels = DEFAULT_PLAYER_LABELS) {
  const isMiss = distance >= MISS_SCORE;
  return createElement(
    "span",
    {
      class: isMiss ? "chip miss" : "chip",
      title: isMiss ? labels.miss : labels.distance(distance),
    },
    String(distance),
  );
}

/** "PDGA #12345 · MPO" */
export function formatPlayerMeta(player, labels = DEFAULT_PLAYER_LABELS) {
  const parts = [player.pdga ? `PDGA #${player.pdga}` : labels.noPdga];
  if (player.division) parts.push(player.division);
  return parts.join(" · ");
}
