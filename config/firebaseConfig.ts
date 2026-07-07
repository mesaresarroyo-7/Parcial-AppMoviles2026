import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzVq3jF1X-K6gADN-gq4AWtlTORZ5eWgI",
  authDomain: "little-caesars-f4b72.firebaseapp.com",
  databaseURL: "https://little-caesars-f4b72-default-rtdb.firebaseio.com",
  projectId: "little-caesars-f4b72",
  storageBucket: "little-caesars-f4b72.firebasestorage.app",
  messagingSenderId: "579533325081",
  appId: "1:579533325081:web:4a93b77760ec69d6193b88",
};
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
