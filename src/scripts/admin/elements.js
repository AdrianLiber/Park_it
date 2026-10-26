import { getRequiredElement } from "../shared/dom.js";

/** Every element the scorekeeper page works with, looked up once. */
export const elements = {
  notConfiguredNotice: getRequiredElement("notConfigured"),
  toast: getRequiredElement("toast"),

  loginForm: getRequiredElement("loginForm"),
  emailInput: getRequiredElement("emailInput"),
  passwordInput: getRequiredElement("passwordInput"),
  loginError: getRequiredElement("loginError"),
  loginButton: getRequiredElement("loginButton"),

  keeperApp: getRequiredElement("keeperApp"),
  signedInAs: getRequiredElement("signedInAs"),
  logoutButton: getRequiredElement("logoutButton"),

  playerSearch: getRequiredElement("playerSearch"),
  playerList: getRequiredElement("playerList"),
  playerListEmpty: getRequiredElement("playerListEmpty"),

  importPanel: getRequiredElement("importPanel"),
  importText: getRequiredElement("importText"),
  importButton: getRequiredElement("importButton"),

  addPlayerForm: getRequiredElement("addPlayerForm"),
  addPlayerName: getRequiredElement("addPlayerName"),
  addPlayerPdga: getRequiredElement("addPlayerPdga"),
  addPlayerDivision: getRequiredElement("addPlayerDivision"),
  addPlayerError: getRequiredElement("addPlayerError"),
  addPlayerButton: getRequiredElement("addPlayerButton"),

  pickPrompt: getRequiredElement("pickPrompt"),
  playerDetail: getRequiredElement("playerDetail"),
  playerName: getRequiredElement("playerName"),
  playerMeta: getRequiredElement("playerMeta"),
  removePlayerButton: getRequiredElement("removePlayerButton"),
  removeConfirm: getRequiredElement("removeConfirm"),
  removeConfirmText: getRequiredElement("removeConfirmText"),
  removeConfirmYes: getRequiredElement("removeConfirmYes"),
  removeConfirmNo: getRequiredElement("removeConfirmNo"),
  roundList: getRequiredElement("roundList"),

  scoreEntryForm: getRequiredElement("scoreEntryForm"),
  scoreEntryTitle: getRequiredElement("scoreEntryTitle"),
  discInputs: [
    getRequiredElement("disc1Input"),
    getRequiredElement("disc2Input"),
    getRequiredElement("disc3Input"),
  ],
  discHints: [
    getRequiredElement("disc1Hint"),
    getRequiredElement("disc2Hint"),
    getRequiredElement("disc3Hint"),
  ],
  liveTotal: getRequiredElement("liveTotal"),
  saveRoundButton: getRequiredElement("saveRoundButton"),
  roundsFullNote: getRequiredElement("roundsFullNote"),
};
