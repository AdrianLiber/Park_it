import { createElement } from "../shared/dom.js";
import { playerMatchesQuery } from "../shared/player-search.js";
import { formatPlayerMeta } from "../shared/player-view.js";
import { getBestRound, getRounds, MAX_ROUNDS } from "../shared/scoring.js";
import { elements } from "./elements.js";
import { keeperState } from "./state.js";

function createPlayerButton(player) {
  const bestRound = getBestRound(player);
  const roundsUsed = getRounds(player).length;

  return createElement(
    "li",
    {},
    createElement(
      "button",
      {
        class: "pick",
        type: "button",
        "data-player-id": player.id,
        "aria-pressed": String(player.id === keeperState.selectedPlayerId),
      },
      createElement("span", { class: "name" }, player.name),
      createElement(
        "span",
        { class: "state" },
        bestRound ? createElement("b", {}, bestRound.total) : null,
        `${roundsUsed}/${MAX_ROUNDS}`,
      ),
      createElement("span", { class: "meta" }, formatPlayerMeta(player)),
    ),
  );
}

function getEmptyListMessage(visibleCount, query) {
  if (keeperState.players.length === 0) {
    return "No players yet. Import the event list below or add a player.";
  }
  if (visibleCount === 0) {
    return `Nobody matches “${query.trim()}”. Add them below if they're not on the list.`;
  }
  return null;
}

export function renderPlayerList() {
  const query = elements.playerSearch.value;
  const visiblePlayers = keeperState.players
    .filter((player) => playerMatchesQuery(player, query))
    .sort((firstPlayer, secondPlayer) => firstPlayer.name.localeCompare(secondPlayer.name));

  elements.playerList.replaceChildren(...visiblePlayers.map(createPlayerButton));
  elements.playerList.hidden = visiblePlayers.length === 0;

  const emptyMessage = getEmptyListMessage(visiblePlayers.length, query);
  elements.playerListEmpty.textContent = emptyMessage ?? "";
  elements.playerListEmpty.hidden = !emptyMessage;
}

/** Calls `onSelect(playerId)` when a player in the list is clicked. */
export function initPlayerList({ onSelect }) {
  elements.playerSearch.addEventListener("input", renderPlayerList);
  elements.playerList.addEventListener("click", (event) => {
    const playerButton = event.target.closest("[data-player-id]");
    if (playerButton) onSelect(playerButton.dataset.playerId);
  });
}
