import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

export const MISS = 300;       // a disc further than 3 m from the flag scores 300 cm
export const MAX_ROUNDS = 3;   // each player gets up to 3 rounds of 3 discs

export const isConfigured =
  Boolean(firebaseConfig.apiKey) && !firebaseConfig.apiKey.startsWith("PASTE");

const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;

export const total = (throws) => throws.reduce((a, b) => a + b, 0);

export function roundsOf(player) {
  return Array.isArray(player.rounds)
    ? player.rounds.filter((r) => r && Array.isArray(r.t) && r.t.length === 3)
    : [];
}

// The round with the lowest total is the one that counts.
export function bestRound(player) {
  let best = null;
  roundsOf(player).forEach((r, index) => {
    const sum = total(r.t);
    if (!best || sum < best.sum) best = { throws: r.t, sum, index };
  });
  return best;
}

// Same total? The player with the closest single disc ranks higher, then the next closest.
function compareBest(a, b) {
  if (a.sum !== b.sum) return a.sum - b.sum;
  const x = [...a.throws].sort((m, n) => m - n);
  const y = [...b.throws].sort((m, n) => m - n);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

export function rankPlayers(players) {
  const scored = [];
  const waiting = [];
  for (const player of players) {
    const best = bestRound(player);
    if (best) scored.push({ player, best });
    else waiting.push(player);
  }
  scored.sort((a, b) => compareBest(a.best, b.best) || a.player.name.localeCompare(b.player.name));
  scored.forEach((row, i) => {
    const tied = i > 0 && compareBest(row.best, scored[i - 1].best) === 0;
    row.rank = tied ? scored[i - 1].rank : i + 1;
  });
  waiting.sort((a, b) => a.name.localeCompare(b.name));
  return { scored, waiting };
}

// "Anđelko" matches "andelko", "Šalov" matches "salov", "#169962" matches the PDGA number.
export function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .replace(/đ/g, "d").replace(/ð/g, "d").replace(/þ/g, "th").replace(/ø/g, "o").replace(/æ/g, "ae")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/#/g, "")
    .trim();
}

export function matches(player, query) {
  const q = normalize(query);
  if (!q) return true;
  return normalize(player.name).includes(q) || String(player.pdga ?? "").includes(q);
}

// Small DOM helper. Text always goes in as text, never as HTML.
export function h(tag, props = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value == null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value === true ? "" : value);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return node;
}

const EN_LABELS = {
  miss: "Outside 3 m: 300",
  cm: (v) => `${v} cm from the flag`,
  noPdga: "No PDGA #",
};

// `labels` lets the leaderboard pass translated texts; the admin page uses English.
export function throwChip(value, labels = EN_LABELS) {
  const miss = value >= MISS;
  return h(
    "span",
    { class: miss ? "chip miss" : "chip", title: miss ? labels.miss : labels.cm(value) },
    String(value)
  );
}

export function playerMeta(player, labels = EN_LABELS) {
  const parts = [player.pdga ? `PDGA #${player.pdga}` : labels.noPdga];
  if (player.division) parts.push(player.division);
  return parts.join(" · ");
}
