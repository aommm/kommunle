import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { app } from "../domain/firebase";
import { HighscoreEntry, Score } from "../domain/score";
import { getDayString } from "./useTodays";

const database = getDatabase(app);

const databaseNamespace = "highscores";
const allHighscoresRef = (today: string) =>
  ref(database, databaseNamespace + "/" + today);

interface HighscoreDatabaseEntry {
  name: string;
  score: Score;
}
type HighscoresDatabase = {
  [k: string]: HighscoreDatabaseEntry;
};

/**
 * @returns [highscores, setHighscoreForUser]
 *    highscores: all highscore entries for today
 *    setHighscoreForUser: add a new highscore entry
 */
export function useHighscoreDatabase(): [
  highscores: HighscoreEntry[],
  setHighscoreForUser: (
    userId: string,
    name: string,
    score: Score,
    date: string
  ) => void
] {
  const [highscores, setHighscores] = useState<HighscoreEntry[]>([]);

  useEffect(() => {
    const today = getDayString();
    onValue(allHighscoresRef(today), (snapshot) => {
      const highscoresDatabase: HighscoresDatabase = snapshot.val();

      // convert db entry to highscore entry
      const highscoreEntries = Object.entries(highscoresDatabase).map(
        ([userId, highscoreDatabaseEntry]) => {
          return { ...highscoreDatabaseEntry, userId };
        }
      );

      setHighscores(highscoreEntries);
    });
  }, []);

  function setHighscoreForUser(
    userId: string,
    name: string,
    score: Score,
    date: string
  ) {
    const existingScore = highscores.find(
      (highscore) => highscore.userId === userId
    );
    if (existingScore) {
      console.log("there's an existing score for this user, don't update");
    } else {
      set(ref(database, databaseNamespace + "/" + date + "/" + userId), {
        name,
        score,
      });
    }
  }

  return [highscores, setHighscoreForUser];
}
