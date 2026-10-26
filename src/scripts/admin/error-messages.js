const WRONG_CREDENTIAL_CODES = new Set([
  "auth/invalid-credential",
  "auth/wrong-password",
  "auth/user-not-found",
  "auth/invalid-email",
]);

/** Turns a Firestore write error into a sentence the scorekeeper can act on. */
export function describeWriteError(error) {
  if (error?.code === "permission-denied") {
    return "This account can't change scores. Only the scorekeeper email listed in firestore.rules can.";
  }
  if (error?.code === "unavailable") return "No connection. Check the internet and try again.";
  return `Couldn't save: ${error?.message || error}`;
}

export function describeSignInError(error) {
  const errorCode = error?.code || "";
  if (WRONG_CREDENTIAL_CODES.has(errorCode)) return "Email or password is wrong.";
  if (errorCode === "auth/too-many-requests") {
    return "Too many attempts. Wait a minute and try again.";
  }
  return `Couldn't sign in: ${error?.message || error}`;
}
