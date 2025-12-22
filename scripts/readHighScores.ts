// This script is for development purposes only.
// It fetches and displays high score data from Firebase for a specific date.
// Usage: ts-node scripts/readHighScores.ts [yyyy-MM-dd]
// Example: ts-node scripts/readHighScores.ts 2023-10-27

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { DateTime } from "luxon";

// Using the same config as in src/domain/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyDZGEBG5PHxhNLNAP5_9CxP_IypUaUAb9s",
  authDomain: "kommunle.firebaseapp.com",
  projectId: "kommunle",
  storageBucket: "kommunle.appspot.com",
  messagingSenderId: "477451683649",
  appId: "1:477451683649:web:cb82af2b03cbf2fd5b03c0",
  databaseURL:
    "https://kommunle-default-rtdb.europe-west1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const databaseNamespace = "highscores";

// Get date from command line args or default to today
const dateArg = process.argv[2];
const targetDate = dateArg || DateTime.now().toFormat("yyyy-MM-dd");

// Simple validation for date format yyyy-MM-dd
if (!/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
  console.error("Invalid date format. Please use yyyy-MM-dd.");
  process.exit(1);
}

console.log(`Reading high scores for date: ${targetDate}`);

const allHighscoresRef = ref(database, `${databaseNamespace}/${targetDate}`);

// Fetch data
onValue(
  allHighscoresRef,
  (snapshot) => {
    const data = snapshot.val();
    if (data) {
      console.log("High scores data found:");
      // Format the output for readability
      const entries = Object.entries(data).map(
        ([userId, entry]: [string, any]) => ({
          userId,
          ...entry,
        })
      );
      entries.sort((a, b) => {
        const keyA = String(a.score) + a.datetime;
        const keyB = String(b.score) + b.datetime;
        return keyA.localeCompare(keyB);
      });
      console.table(entries);
      console.log(`Total entries: ${entries.length}`);
    } else {
      console.log(`No high scores found for ${targetDate}.`);
    }
    // Exit after reading
    process.exit(0);
  },
  (error) => {
    console.error("Error reading from Firebase:", error);
    process.exit(1);
  }
);

// Add a timeout in case the connection hangs
setTimeout(() => {
  console.log("Timeout reached. Exiting...");
  process.exit(0);
}, 10000);
