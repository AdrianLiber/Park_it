import "../../styles/admin.scss";

import { collection, onSnapshot } from "firebase/firestore";
import { database, isFirebaseConfigured, PLAYERS_COLLECTION } from "../shared/firebase.js";
import { initAddPlayer } from "./add-player.js";
import { elements } from "./elements.js";
import { initImportPlayers, renderImportPanel } from "./import-players.js";
import { initPlayerDetail, renderPlayerDetail, selectPlayer } from "./player-detail.js";
import { initPlayerList, renderPlayerList } from "./player-list.js";
import { initScoreEntry } from "./score-entry.js";
import { initSession } from "./session.js";
import { getSelectedPlayer, keeperState } from "./state.js";
import { showErrorToast } from "./toast.js";

let stopWatchingPlayers = null;

function renderAll() {
  renderPlayerList();
  renderImportPanel();
  renderPlayerDetail();
}

function watchPlayers() {
  stopWatchingPlayers = onSnapshot(
    collection(database, PLAYERS_COLLECTION),
    (snapshot) => {
      keeperState.players = snapshot.docs.map((playerDoc) => ({
        id: playerDoc.id,
        ...playerDoc.data(),
      }));
      // The selected player may have been removed (here or on another device).
      if (keeperState.selectedPlayerId && !getSelectedPlayer()) {
        keeperState.selectedPlayerId = null;
      }
      renderAll();
    },
    (error) => showErrorToast(`Player list couldn't load: ${error.message}`),
  );
}

function stopWatching() {
  stopWatchingPlayers?.();
  stopWatchingPlayers = null;
}

if (isFirebaseConfigured) {
  initPlayerList({ onSelect: selectPlayer });
  initPlayerDetail();
  initScoreEntry();
  initAddPlayer();
  initImportPlayers();
  initSession({
    onSignIn: () => {
      stopWatching();
      watchPlayers();
    },
    onSignOut: () => {
      stopWatching();
      keeperState.players = [];
      keeperState.selectedPlayerId = null;
    },
  });
} else {
  elements.notConfiguredNotice.hidden = false;
}
