import { createElement, getRequiredElement } from "../shared/dom.js";
import { playerMatchesQuery } from "../shared/player-search.js";
import { createThrowChip, formatPlayerMeta } from "../shared/player-view.js";
import { getRounds, rankPlayers } from "../shared/scoring.js";

const boardList = getRequiredElement("board");
const boardEmpty = getRequiredElement("boardEmpty");
const boardCount = getRequiredElement("boardCount");
const waitingSection = getRequiredElement("waiting");
const waitingTitle = getRequiredElement("waitingTitle");
const waitingList = getRequiredElement("waitingList");

function showEmptyMessage([title, description]) {
  boardList.replaceChildren();
  const messageParts = [createElement("strong", {}, title)];
  if (description) messageParts.push(createElement("span", {}, description));
  boardEmpty.replaceChildren(...messageParts);
  boardEmpty.hidden = false;
}

function getRowClass(rank) {
  if (rank === 1) return "row lead";
  if (rank <= 3) return "row podium";
  return "row";
}

function createBoardRow({ player, bestRound, rank }, texts) {
  return createElement(
    "li",
    { class: getRowClass(rank) },
    createElement("span", { class: "rank", "aria-label": texts.rank(rank) }, rank),
    createElement(
      "div",
      { class: "who" },
      createElement("span", { class: "name" }, player.name),
      createElement("span", { class: "meta" }, formatPlayerMeta(player, texts.player)),
      createElement(
        "div",
        { class: "throws", "aria-label": texts.bestRound },
        bestRound.throws.map((distance) => createThrowChip(distance, texts.player)),
      ),
    ),
    createElement(
      "div",
      { class: "total" },
      createElement(
        "span",
        { class: "sum", "aria-label": texts.total(bestRound.total) },
        bestRound.total,
      ),
      createElement("span", { class: "tries" }, texts.roundsUsed(getRounds(player).length)),
    ),
  );
}

function renderScoredRows(players, scoredRows, query, texts) {
  if (players.length === 0) return showEmptyMessage(texts.noPlayers);
  if (scoredRows.length === 0) return showEmptyMessage(texts.noRounds);

  const visibleRows = scoredRows.filter((row) => playerMatchesQuery(row.player, query));
  if (visibleRows.length === 0) return showEmptyMessage(texts.noMatch(query.trim()));

  boardEmpty.hidden = true;
  boardList.replaceChildren(...visibleRows.map((row) => createBoardRow(row, texts)));
}

function renderWaitingPlayers(waitingPlayers, query, texts) {
  const visiblePlayers = waitingPlayers.filter((player) => playerMatchesQuery(player, query));

  waitingSection.hidden = visiblePlayers.length === 0;
  waitingTitle.textContent = texts.waiting(visiblePlayers.length);
  waitingList.replaceChildren(
    ...visiblePlayers.map((player) =>
      createElement(
        "li",
        {},
        createElement("span", {}, player.name),
        createElement("span", {}, player.pdga ? `#${player.pdga}` : ""),
      ),
    ),
  );

  // Searching for someone who hasn't thrown yet should show them straight away.
  if (query.trim() && visiblePlayers.length > 0) waitingSection.open = true;
}

/**
 * @param {object} boardState
 * @param {"connecting"|"ready"|"notConfigured"|"error"} boardState.status
 * @param {Array|null} boardState.players
 * @param {string} boardState.errorMessage
 * @param {string} boardState.query
 * @param {object} boardState.texts  texts for the current language
 */
export function renderLeaderboard({ status, players, errorMessage, query, texts }) {
  if (status === "notConfigured") {
    boardCount.textContent = texts.notConnected;
    return showEmptyMessage(texts.notConfigured);
  }
  if (status === "error") {
    boardCount.textContent = texts.offline;
    return showEmptyMessage(texts.loadError(errorMessage));
  }
  if (!players) {
    boardCount.textContent = texts.connecting;
    return showEmptyMessage([texts.loading]);
  }

  const { scoredRows, waitingPlayers } = rankPlayers(players);
  boardCount.textContent = texts.thrownCount(scoredRows.length, players.length);
  renderScoredRows(players, scoredRows, query, texts);
  renderWaitingPlayers(waitingPlayers, query, texts);
}
