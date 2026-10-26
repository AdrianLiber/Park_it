// Letters that don't split into "base letter + accent", so they need an explicit replacement.
const SPECIAL_LETTERS = [
  [/đ/g, "d"],
  [/ð/g, "d"],
  [/þ/g, "th"],
  [/ø/g, "o"],
  [/æ/g, "ae"],
];

const COMBINING_ACCENTS = /[̀-ͯ]/g;

/** "Anđelko" → "andelko", "Šalov" → "salov", "#169962" → "169962". */
export function normalizeSearchText(text) {
  let normalized = String(text ?? "").toLowerCase();
  for (const [pattern, replacement] of SPECIAL_LETTERS) {
    normalized = normalized.replace(pattern, replacement);
  }
  return normalized.normalize("NFD").replace(COMBINING_ACCENTS, "").replace(/#/g, "").trim();
}

/** Matches on the player's name (ignoring accents) or PDGA number. */
export function playerMatchesQuery(player, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;
  return (
    normalizeSearchText(player.name).includes(normalizedQuery) ||
    String(player.pdga ?? "").includes(normalizedQuery)
  );
}
