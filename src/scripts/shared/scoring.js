/** A disc further than 3 m from the flag scores 300 cm. */
export const MISS_SCORE = 300;

/** Each player gets up to 3 rounds. */
export const MAX_ROUNDS = 3;

/** Each round is 3 discs. */
export const DISCS_PER_ROUND = 3;

/** Highest possible round total (3 misses). */
export const MAX_ROUND_TOTAL = MISS_SCORE * DISCS_PER_ROUND;

/**
 * Firestore stores each round as `{ t: [cm, cm, cm], at: timestamp }`.
 * The short field names are the saved data format, so they only appear in
 * `getRounds` and `toStoredRound`. Everywhere else a round is `{ throws, savedAt }`.
 */
export function getRounds(player) {
  if (!Array.isArray(player?.rounds)) return [];
  return player.rounds
    .filter(
      (storedRound) =>
        storedRound && Array.isArray(storedRound.t) && storedRound.t.length === DISCS_PER_ROUND,
    )
    .map((storedRound) => ({ throws: storedRound.t, savedAt: storedRound.at ?? null }));
}

export function toStoredRound(round) {
  return { t: round.throws, at: round.savedAt };
}

export function sumThrows(throws) {
  return throws.reduce((runningTotal, distance) => runningTotal + distance, 0);
}

/** The round with the lowest total is the one that counts. */
export function getBestRound(player) {
  let bestRound = null;
  getRounds(player).forEach((round, roundIndex) => {
    const roundTotal = sumThrows(round.throws);
    if (!bestRound || roundTotal < bestRound.total) {
      bestRound = { throws: round.throws, total: roundTotal, roundIndex };
    }
  });
  return bestRound;
}

/** Same total? The player with the closest single disc ranks higher, then the next closest. */
function compareBestRounds(firstRound, secondRound) {
  if (firstRound.total !== secondRound.total) return firstRound.total - secondRound.total;

  const byDistance = (shorter, longer) => shorter - longer;
  const firstSorted = [...firstRound.throws].sort(byDistance);
  const secondSorted = [...secondRound.throws].sort(byDistance);

  for (let discIndex = 0; discIndex < DISCS_PER_ROUND; discIndex++) {
    if (firstSorted[discIndex] !== secondSorted[discIndex]) {
      return firstSorted[discIndex] - secondSorted[discIndex];
    }
  }
  return 0;
}

const byName = (firstPlayer, secondPlayer) => firstPlayer.name.localeCompare(secondPlayer.name);

/**
 * Splits players into those with at least one round (ranked) and those still waiting (by name).
 * Tied players share a rank.
 */
export function rankPlayers(players) {
  const scoredRows = [];
  const waitingPlayers = [];

  for (const player of players) {
    const bestRound = getBestRound(player);
    if (bestRound) scoredRows.push({ player, bestRound });
    else waitingPlayers.push(player);
  }

  scoredRows.sort(
    (firstRow, secondRow) =>
      compareBestRounds(firstRow.bestRound, secondRow.bestRound) ||
      byName(firstRow.player, secondRow.player),
  );

  scoredRows.forEach((row, rowIndex) => {
    const previousRow = scoredRows[rowIndex - 1];
    const isTied = previousRow && compareBestRounds(row.bestRound, previousRow.bestRound) === 0;
    row.rank = isTied ? previousRow.rank : rowIndex + 1;
  });

  waitingPlayers.sort(byName);
  return { scoredRows, waitingPlayers };
}
