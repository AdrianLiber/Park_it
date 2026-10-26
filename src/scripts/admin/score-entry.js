import { doc, updateDoc } from "firebase/firestore";
import { database, PLAYERS_COLLECTION } from "../shared/firebase.js";
import { getRounds, MAX_ROUNDS, sumThrows, toStoredRound } from "../shared/scoring.js";
import { elements } from "./elements.js";
import { describeWriteError } from "./error-messages.js";
import { describeThrow, isValidThrow, parseThrow } from "./throw-input.js";
import { getSelectedPlayer, keeperState } from "./state.js";
import { showErrorToast, showToast } from "./toast.js";

const { discInputs, discHints } = elements;

/** Updates each disc's hint and the running round total while the scorekeeper types. */
export function updateLiveTotal() {
  let roundTotal = 0;
  let isComplete = true;

  discInputs.forEach((discInput, discIndex) => {
    const distance = parseThrow(discInput.value);
    const hint = discHints[discIndex];
    hint.className = "hint";

    if (distance === null) {
      hint.textContent = "";
      isComplete = false;
    } else if (Number.isNaN(distance)) {
      hint.textContent = "Not a number";
      hint.className = "hint bad";
      isComplete = false;
    } else {
      hint.textContent = describeThrow(discInput.value, distance);
      roundTotal += distance;
    }

    if (!Number.isNaN(distance)) discInput.removeAttribute("aria-invalid");
  });

  elements.liveTotal.textContent = isComplete ? roundTotal : "–";
}

export function clearScoreEntry() {
  discInputs.forEach((discInput) => {
    discInput.value = "";
    discInput.removeAttribute("aria-invalid");
  });
  updateLiveTotal();
}

export function focusFirstDisc(options) {
  discInputs[0].focus(options);
}

/** Marks empty or invalid discs and returns the index of the first one, or -1 if all are fine. */
function markInvalidDiscs(distances) {
  let firstInvalidIndex = -1;
  distances.forEach((distance, discIndex) => {
    if (isValidThrow(distance)) return;
    discInputs[discIndex].setAttribute("aria-invalid", "true");
    if (firstInvalidIndex < 0) firstInvalidIndex = discIndex;
  });
  return firstInvalidIndex;
}

async function saveRound(event) {
  event.preventDefault();
  const player = getSelectedPlayer();
  if (!player || keeperState.isSaving) return;

  const distances = discInputs.map((discInput) => parseThrow(discInput.value));
  const firstInvalidIndex = markInvalidDiscs(distances);
  if (firstInvalidIndex >= 0) {
    showErrorToast("Enter all 3 discs. Use # for a disc outside 3 m.");
    discInputs[firstInvalidIndex].focus();
    return;
  }

  const rounds = getRounds(player);
  if (rounds.length >= MAX_ROUNDS) return;
  const updatedRounds = [...rounds, { throws: distances, savedAt: Date.now() }];

  keeperState.isSaving = true;
  elements.saveRoundButton.disabled = true;
  try {
    await updateDoc(doc(database, PLAYERS_COLLECTION, player.id), {
      rounds: updatedRounds.map(toStoredRound),
    });
    showToast(`Round ${updatedRounds.length} saved for ${player.name}: ${sumThrows(distances)}`);
    clearScoreEntry();
    if (updatedRounds.length < MAX_ROUNDS) focusFirstDisc();
  } catch (error) {
    showErrorToast(describeWriteError(error));
  } finally {
    keeperState.isSaving = false;
    elements.saveRoundButton.disabled = false;
  }
}

function markDiscAsMiss(missButton) {
  const discInput = document.getElementById(missButton.dataset.for);
  discInput.value = "#";
  updateLiveTotal();

  const nextInput = discInputs[discInputs.indexOf(discInput) + 1];
  (nextInput ?? elements.saveRoundButton).focus();
}

export function initScoreEntry() {
  discInputs.forEach((discInput, discIndex) => {
    discInput.addEventListener("input", updateLiveTotal);
    discInput.addEventListener("keydown", (event) => {
      const nextInput = discInputs[discIndex + 1];
      if (event.key === "Enter" && nextInput) {
        event.preventDefault();
        nextInput.focus();
      }
    });
  });

  document.querySelectorAll(".miss-btn").forEach((missButton) => {
    missButton.addEventListener("click", () => markDiscAsMiss(missButton));
  });

  elements.scoreEntryForm.addEventListener("submit", saveRound);
}
