import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../config/firebase-config.js";

export const PLAYERS_COLLECTION = "players";

export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) && !firebaseConfig.apiKey.startsWith("PASTE");

export const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const database = firebaseApp ? getFirestore(firebaseApp) : null;
