import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { createElement } from "../shared/dom.js";
import { database, PLAYERS_COLLECTION } from "../shared/firebase.js";
import { createThrowChip, formatPlayerMeta } from "../shared/player-view.js";
import {
  getBestRound,
  getRounds,
  MAX_ROUNDS,
  sumThrows,
  toStoredRound,
} from "../shared/scoring.js";
import { elements } from "./elements.js";
import { describeWriteError } from "./error-messages.js";
import { renderPlayerList } from "./player-list.js";
import { clearScoreEntry, focusFirstDisc } from "./score-entry.js";
import { getSelectedPlayer, keeperState } from "./state.js";
import { showErrorToast, showToast } from "./toast.js";

// Matches the phone layout in styles/pages/_scorekeeper.scss, where score entry sits above the list.
const PHONE_LAYOUT_QUERY = "(max-width: 859px)";

function createEmptyRoundItem(roundIndex, roundsThrown) {
  return createElement(
    "li",
    { class: "round open" },
    createElement("span", { class: "round-label" }, `Round ${roundIndex + 1}`),
    createElement("span", {}, roundIndex === roundsThrown ? "Up next" : "Not thrown"),
  );
}

function createDeleteConfirm(roundIndex, roundTotal) {
  return createElement(
    "div",
    { class: "confirm" },
    createElement("span", {}, `Delete round ${roundIndex + 1} (${roundTotal})?`),
    createElement(
      "button",
      { class: "btn small solid-danger", type: "button", "data-action": "confirm-delete-round" },
      "Delete",
    ),
    createElement(
      "button",
      { class: "btn ghost small", type: "button", "data-action": "cancel-delete-round" },
      "Cancel",
    ),
  );
}

function createRoundItem(round, roundIndex, isBest) {
  const roundTotal = sumThrows(round.throws);
  const roundItem = createElement(
    "li",
    { class: isBest ? "round best" : "round" },
    createElement("span", { class: "round-label" }, `Round ${roundIndex + 1}`),
    createElement(
      "div",
      { class: "throws" },
      round.throws.map((distance) => createThrowChip(distance)),
    ),
    createElement(
      "span",
      { class: "round-summary" },
      isBest ? createElement("span", { class: "badge" }, "Counts") : null,
      createElement("span", { class: "sum" }, roundTotal),
    ),
    createElement(
      "button",
      {
        class: "icon-btn",
        type: "button",
        "data-action": "ask-delete-round",
        "data-round-index": roundIndex,
        "aria-label": `Delete round ${roundIndex + 1}`,
        title: "Delete round",
      },
      "✕",
    ),
  );

  if (keeperState.pendingRoundDeleteIndex === roundIndex) {
    roundItem.append(createDeleteConfirm(roundIndex, roundTotal));
  }
  return roundItem;
}

export function renderPlayerDetail() {
  const player = getSelectedPlayer();
  elements.pickPrompt.hidden = Boolean(player);
  elements.playerDetail.hidden = !player;
  if (!player) return;

  elements.playerName.textContent = player.name;
  elements.playerMeta.textContent = formatPlayerMeta(player);
  elements.removeConfirmText.textContent = `Remove ${player.name} and all their rounds?`;

  const rounds = getRounds(player);
  const bestRound = getBestRound(player);
  const roundItems = [];
  for (let roundIndex = 0; roundIndex < MAX_ROUNDS; roundIndex++) {
    const round = rounds[roundIndex];
    if (!round) {
      roundItems.push(createEmptyRoundItem(roundIndex, rounds.length));
      continue;
    }
    // Only highlight the counting round once there's more than one to choose from.
    const isBest = rounds.length > 1 && bestRound?.roundIndex === roundIndex;
    roundItems.push(createRoundItem(round, roundIndex, isBest));
  }
  elements.roundList.replaceChildren(...roundItems);

  const hasAllRounds = rounds.length >= MAX_ROUNDS;
  elements.scoreEntryForm.hidden = hasAllRounds;
  elements.roundsFullNote.hidden = !hasAllRounds;
  elements.scoreEntryTitle.textContent = `Round ${rounds.length + 1}`;
}

export function selectPlayer(playerId) {
  if (keeperState.selectedPlayerId !== playerId) {
    keeperState.selectedPlayerId = playerId;
    keeperState.pendingRoundDeleteIndex = null;
    elements.removeConfirm.hidden = true;
    clearScoreEntry();
  }
  renderPlayerList();
  renderPlayerDetail();

  if (window.matchMedia(PHONE_LAYOUT_QUERY).matches) {
    elements.playerDetail.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (getRounds(getSelectedPlayer()).length < MAX_ROUNDS) {
    focusFirstDisc({ preventScroll: true });
  }
}

async function deleteRound(roundIndex) {
  const player = getSelectedPlayer();
  if (!player || keeperState.isSaving) return;

  const remainingRounds = getRounds(player).filter(
    (round, otherIndex) => otherIndex !== roundIndex,
  );
  keeperState.isSaving = true;
  try {
    await updateDoc(doc(database, PLAYERS_COLLECTION, player.id), {
      rounds: remainingRounds.map(toStoredRound),
    });
    keeperState.pendingRoundDeleteIndex = null;
    showToast(`Round ${roundIndex + 1} deleted for ${player.name}`);
  } catch (error) {
    showErrorToast(describeWriteError(error));
  } finally {
    keeperState.isSaving = false;
    renderPlayerDetail();
  }
}

async function removeSelectedPlayer() {
  const player = getSelectedPlayer();
  if (!player || keeperState.isSaving) return;

  keeperState.isSaving = true;
  try {
    await deleteDoc(doc(database, PLAYERS_COLLECTION, player.id));
    showToast(`${player.name} removed`);
    keeperState.selectedPlayerId = null;
    elements.removeConfirm.hidden = true;
    renderPlayerDetail();
  } catch (error) {
    showErrorToast(describeWriteError(error));
  } finally {
    keeperState.isSaving = false;
  }
}

/** Handles the ✕ / Delete / Cancel buttons inside the round list. */
function handleRoundListClick(event) {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  switch (actionButton.dataset.action) {
    case "ask-delete-round":
      keeperState.pendingRoundDeleteIndex = Number(actionButton.dataset.roundIndex);
      renderPlayerDetail();
      break;
    case "confirm-delete-round":
      deleteRound(keeperState.pendingRoundDeleteIndex);
      break;
    case "cancel-delete-round":
      keeperState.pendingRoundDeleteIndex = null;
      renderPlayerDetail();
      break;
  }
}

export function initPlayerDetail() {
  elements.roundList.addEventListener("click", handleRoundListClick);
  elements.removePlayerButton.addEventListener("click", () => {
    elements.removeConfirm.hidden = false;
  });
  elements.removeConfirmNo.addEventListener("click", () => {
    elements.removeConfirm.hidden = true;
  });
  elements.removeConfirmYes.addEventListener("click", removeSelectedPlayer);
}
