import { collection, doc, setDoc } from "firebase/firestore";
import { database, PLAYERS_COLLECTION } from "../shared/firebase.js";
import { elements } from "./elements.js";
import { describeWriteError } from "./error-messages.js";
import { selectPlayer } from "./player-detail.js";
import { keeperState } from "./state.js";
import { showToast } from "./toast.js";

const PDGA_NUMBER_PATTERN = /^\d{1,7}$/;

function showFormError(message, inputToFocus) {
  elements.addPlayerError.textContent = message;
  elements.addPlayerError.hidden = false;
  inputToFocus?.focus();
}

/** Returns an error message, or null when the new player is fine to save. */
function validateNewPlayer({ name, pdga }) {
  if (!name) return { message: "Enter the player's name.", input: elements.addPlayerName };
  if (pdga && !PDGA_NUMBER_PATTERN.test(pdga)) {
    return { message: "The PDGA number can only contain digits.", input: elements.addPlayerPdga };
  }
  const existingPlayer = pdga && keeperState.players.find((player) => String(player.pdga) === pdga);
  if (existingPlayer) {
    return { message: `PDGA #${pdga} is already on the list as ${existingPlayer.name}.` };
  }
  return null;
}

async function addPlayer(event) {
  event.preventDefault();
  elements.addPlayerError.hidden = true;

  const newPlayer = {
    name: elements.addPlayerName.value.trim().replace(/\s+/g, " "),
    pdga: elements.addPlayerPdga.value.trim().replace(/^#/, ""),
    division: elements.addPlayerDivision.value,
  };

  const validationError = validateNewPlayer(newPlayer);
  if (validationError) {
    showFormError(validationError.message, validationError.input);
    return;
  }

  // Players with a PDGA number use it as their id, so the import can't add them twice.
  const playerRef = newPlayer.pdga
    ? doc(database, PLAYERS_COLLECTION, newPlayer.pdga)
    : doc(collection(database, PLAYERS_COLLECTION));

  elements.addPlayerButton.disabled = true;
  try {
    await setDoc(playerRef, { ...newPlayer, rounds: [] });
    elements.addPlayerForm.reset();
    showToast(`${newPlayer.name} added`);
    selectPlayer(playerRef.id);
  } catch (error) {
    showFormError(describeWriteError(error));
  } finally {
    elements.addPlayerButton.disabled = false;
  }
}

export function initAddPlayer() {
  elements.addPlayerForm.addEventListener("submit", addPlayer);
}
