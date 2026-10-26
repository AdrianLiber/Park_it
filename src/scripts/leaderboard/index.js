import "../../styles/leaderboard.scss";

import { collection, onSnapshot } from "firebase/firestore";
import { getRequiredElement } from "../shared/dom.js";
import { database, isFirebaseConfigured, PLAYERS_COLLECTION } from "../shared/firebase.js";
import { applyStaticTranslations, getInitialLanguage, saveLanguage } from "./language.js";
import { renderLeaderboard } from "./render-board.js";

const searchInput = getRequiredElement("search");
const posterImage = getRequiredElement("poster");

const boardState = {
  language: getInitialLanguage(),
  texts: null,
  status: isFirebaseConfigured ? "connecting" : "notConfigured",
  players: null,
  errorMessage: "",
};

function render() {
  renderLeaderboard({ ...boardState, query: searchInput.value });
}

function setLanguage(language) {
  boardState.language = language;
  boardState.texts = applyStaticTranslations(language);
  render();
}

function hidePosterIfBroken() {
  if (posterImage.complete && posterImage.naturalWidth === 0) posterImage.remove();
}

function watchPlayers() {
  onSnapshot(
    collection(database, PLAYERS_COLLECTION),
    (snapshot) => {
      boardState.players = snapshot.docs.map((playerDoc) => ({
        id: playerDoc.id,
        ...playerDoc.data(),
      }));
      boardState.status = "ready";
      render();
    },
    (error) => {
      boardState.status = "error";
      boardState.errorMessage = error.message;
      render();
    },
  );
}

document.querySelectorAll("[data-lang]").forEach((languageButton) => {
  languageButton.addEventListener("click", () => {
    saveLanguage(languageButton.dataset.lang);
    setLanguage(languageButton.dataset.lang);
  });
});

searchInput.addEventListener("input", render);
posterImage.addEventListener("error", () => posterImage.remove());
hidePosterIfBroken();

if (isFirebaseConfigured) watchPlayers();
setLanguage(boardState.language);
