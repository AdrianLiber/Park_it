/** Shared, mutable state of the scorekeeper page. */
export const keeperState = {
  players: [],
  selectedPlayerId: null,
  /** Index of the round waiting for its "Delete?" confirmation, or null. */
  pendingRoundDeleteIndex: null,
  /** True while a write to Firestore is in progress, so a second click can't double-save. */
  isSaving: false,
};

export function getSelectedPlayer() {
  return keeperState.players.find((player) => player.id === keeperState.selectedPlayerId) ?? null;
}
