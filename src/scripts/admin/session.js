import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseApp } from "../shared/firebase.js";
import { elements } from "./elements.js";
import { describeSignInError } from "./error-messages.js";

// Only the scorekeeper page signs in, so the leaderboard never loads Firebase Auth.
const authentication = firebaseApp ? getAuth(firebaseApp) : null;

async function signIn(event) {
  event.preventDefault();
  elements.loginError.hidden = true;
  elements.loginButton.disabled = true;
  try {
    await signInWithEmailAndPassword(
      authentication,
      elements.emailInput.value.trim(),
      elements.passwordInput.value,
    );
  } catch (error) {
    elements.loginError.textContent = describeSignInError(error);
    elements.loginError.hidden = false;
  } finally {
    elements.loginButton.disabled = false;
  }
}

/**
 * Shows the sign-in form or the scorekeeper tools, and calls `onSignIn(user)` / `onSignOut()`
 * whenever that changes.
 */
export function initSession({ onSignIn, onSignOut }) {
  elements.loginForm.addEventListener("submit", signIn);
  elements.logoutButton.addEventListener("click", () => signOut(authentication));

  onAuthStateChanged(authentication, (user) => {
    elements.loginForm.hidden = Boolean(user);
    elements.keeperApp.hidden = !user;
    if (user) {
      elements.signedInAs.textContent = `Signed in as ${user.email}`;
      onSignIn(user);
    } else {
      onSignOut();
    }
  });
}
