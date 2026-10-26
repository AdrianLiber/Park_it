import { MAX_ROUNDS } from "../shared/scoring.js";

/** Croatian plural: 1, 21, 31… → "igrač", everything else → "igrača". */
function croatianPlayerWord(count) {
  return count % 10 === 1 && count % 100 !== 11 ? "igrač" : "igrača";
}

export const TRANSLATIONS = {
  en: {
    eyebrow: "Drava Forester 2026 · Varaždin · Halloween edition",
    rulesLabel: "Rules",
    ruleDiscs: "<b>3 discs</b> per round",
    ruleRounds: "<b>Up to 3</b> rounds",
    ruleMiss: "Outside 3 m <b>= 300</b>",
    ruleUnits: "Distances in <b>cm</b>",
    ruleWinner: "<b>Lowest</b> total wins",
    posterAlt:
      "Drava Forester 14th annual disc golf party poster: a pumpkin-headed player throwing a disc at a basket under a full moon, Varaždin, 30 Oct – 1 Nov 2026",
    searchPlaceholder: "Find your name or PDGA number",
    searchLabel: "Find a player",
    boardTitle: "Best round per player",
    footer: "Each player's best of up to 3 rounds counts. Ties go to the closest single disc.",
    scorekeeper: "Scorekeeper",
    connecting: "Connecting…",
    notConnected: "Not connected",
    offline: "Offline",
    loading: "Loading the leaderboard…",
    thrownCount: (thrownCount, playerCount) =>
      `${thrownCount} of ${playerCount} players have thrown`,
    noPlayers: ["No players yet.", "The scorekeeper adds players from the Scorekeeper page."],
    noRounds: [
      "No rounds thrown yet.",
      "Scores appear here the moment the scorekeeper saves a round.",
    ],
    noMatch: (query) => [
      `No score for “${query}” yet.`,
      "Check the spelling, or look in the list of players who haven't thrown.",
    ],
    roundsUsed: (roundCount) => `${roundCount} of ${MAX_ROUNDS} rounds`,
    rank: (rank) => `Rank ${rank}`,
    total: (total) => `Total ${total}`,
    bestRound: "Best round, cm from the flag",
    waiting: (count) => `Not thrown yet · ${count} ${count === 1 ? "player" : "players"}`,
    notConfigured: [
      "This leaderboard isn't connected to Firebase yet.",
      "Add your Firebase project settings to firebase-config.js.",
    ],
    loadError: (message) => [
      "The leaderboard couldn't load.",
      `${message} Refresh the page to try again.`,
    ],
    player: {
      miss: "Outside 3 m: 300",
      distance: (distance) => `${distance} cm from the flag`,
      noPdga: "No PDGA #",
    },
  },
  hr: {
    eyebrow: "Drava Forester 2026 · Varaždin · Halloween izdanje",
    rulesLabel: "Pravila",
    ruleDiscs: "<b>3 diska</b> po rundi",
    ruleRounds: "<b>Do 3</b> runde",
    ruleMiss: "Izvan 3 m <b>= 300</b>",
    ruleUnits: "Udaljenosti u <b>cm</b>",
    ruleWinner: "<b>Najmanji</b> zbroj pobjeđuje",
    posterAlt:
      "Plakat 14. Drava Forester disc golf partyja: igrač s glavom bundeve baca disk prema košu pod punim mjesecom, Varaždin, 30. 10. – 1. 11. 2026.",
    searchPlaceholder: "Pronađi svoje ime ili PDGA broj",
    searchLabel: "Pronađi igrača",
    boardTitle: "Najbolja runda po igraču",
    footer:
      "Računa se najbolja od najviše 3 runde. Kod jednakog zbroja bolji je igrač s najbližim pojedinačnim diskom.",
    scorekeeper: "Zapisničar",
    connecting: "Spajanje…",
    notConnected: "Nije povezano",
    offline: "Nema veze",
    loading: "Učitavanje ljestvice…",
    thrownCount: (thrownCount, playerCount) => `Bacilo je ${thrownCount} od ${playerCount} igrača`,
    noPlayers: ["Još nema igrača.", "Zapisničar dodaje igrače na svojoj stranici."],
    noRounds: [
      "Još nitko nije bacao.",
      "Rezultati se pojavljuju ovdje čim zapisničar spremi rundu.",
    ],
    noMatch: (query) => [
      `Još nema rezultata za „${query}”.`,
      "Provjeri pravopis imena ili pogledaj popis igrača koji još nisu bacali.",
    ],
    roundsUsed: (roundCount) => `${roundCount} od ${MAX_ROUNDS} runde`,
    rank: (rank) => `${rank}. mjesto`,
    total: (total) => `Zbroj ${total}`,
    bestRound: "Najbolja runda, cm od zastavice",
    waiting: (count) => `Još nisu bacali · ${count} ${croatianPlayerWord(count)}`,
    notConfigured: [
      "Ljestvica još nije povezana s Firebaseom.",
      "Dodaj postavke Firebase projekta u firebase-config.js.",
    ],
    loadError: (message) => [
      "Ljestvica se nije mogla učitati.",
      `${message} Osvježi stranicu i pokušaj ponovno.`,
    ],
    player: {
      miss: "Izvan 3 m: 300",
      distance: (distance) => `${distance} cm od zastavice`,
      noPdga: "Bez PDGA broja",
    },
  },
};
