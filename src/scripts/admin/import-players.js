import { doc, writeBatch } from "firebase/firestore";
import { EVENT_PLAYERS } from "../data/event-players.js";
import { database, PLAYERS_COLLECTION } from "../shared/firebase.js";
import { elements } from "./elements.js";
import { describeWriteError } from "./error-messages.js";
import { keeperState } from "./state.js";
import { showErrorToast, showToast } from "./toast.js";

/** Event players (from PDGA) that aren't in the database yet. */
function findMissingEventPlayers() {
  const existingIds = new Set(keeperState.players.map((player) => player.id));
  return EVENT_PLAYERS.filter(({ pdga }) => !existingIds.has(pdga));
}

export function renderImportPanel() {
  const missingPlayers = findMissingEventPlayers();
  const eventPlayerCount = EVENT_PLAYERS.length;
  const isFirstImport = keeperState.players.length === 0;

  elements.importPanel.hidden = missingPlayers.length === 0;
  elements.importText.textContent = isFirstImport
    ? `Load all ${eventPlayerCount} players registered for Drava Forester on PDGA.`
    : `${missingPlayers.length} of ${eventPlayerCount} event players aren't on the list yet.`;
  elements.importButton.textContent = isFirstImport
    ? `Import ${eventPlayerCount} players`
    : `Add ${missingPlayers.length} missing players`;
}

async function importMissingPlayers() {
  const missingPlayers = findMissingEventPlayers();
  if (missingPlayers.length === 0) return;

  elements.importButton.disabled = true;
  try {
    const batch = writeBatch(database);
    for (const { division, name, pdga } of missingPlayers) {
      batch.set(doc(database, PLAYERS_COLLECTION, pdga), { name, pdga, division, rounds: [] });
    }
    await batch.commit();
    showToast(`${missingPlayers.length} players imported`);
  } catch (error) {
    showErrorToast(describeWriteError(error));
  } finally {
    elements.importButton.disabled = false;
  }
}

export function initImportPlayers() {
  elements.importButton.addEventListener("click", importMissingPlayers);
}
