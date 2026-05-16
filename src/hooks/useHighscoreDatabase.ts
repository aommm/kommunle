import { getDatabase, onValue, ref, runTransaction } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { app } from "../domain/firebase";
import { HighscoreEntry, Score } from "../domain/score";

const database = getDatabase(app);

const databaseNamespace = "highscores";
const allHighscoresRef = (today: string) =>
  ref(database, databaseNamespace + "/" + today);

interface HighscoreDatabaseEntry {
  name: string;
  score: Score;
  datetime: string;
}
type HighscoresDatabase = {
  [k: string]: HighscoreDatabaseEntry;
};

/**
 * @param dayString - the date to read/write highscores for (yyyy-MM-dd)
 * @returns [highscores, setHighscoreForUser]
 *    highscores: all highscore entries for the given day
 *    setHighscoreForUser: add a new highscore entry
 */
export function useHighscoreDatabase(
  dayString: string
): [
  highscores: HighscoreEntry[],
  setHighscoreForUser: (
    userId: string,
    name: string,
    score: Score,
    datetime: string
  ) => void
] {
  const [highscores, setHighscores] = useState<HighscoreEntry[]>([]);

  useEffect(() => {
    onValue(allHighscoresRef(dayString), (snapshot) => {
      const highscoresDatabase: HighscoresDatabase = snapshot.val();

      // convert db entry to highscore entry
      const highscoreEntries = Object.entries(highscoresDatabase).map(
        ([userId, highscoreDatabaseEntry]) => {
          return { ...highscoreDatabaseEntry, userId };
        }
      );

      setHighscores(highscoreEntries);
    });
  }, [dayString]);

  const setHighscoreForUser = useCallback(
    (userId: string, name: string, score: Score, datetime: string) => {
      runTransaction(
        ref(database, databaseNamespace + "/" + dayString + "/" + userId),
        (currentData) => {
          if (currentData === null) {
            console.log(
              `Saving score for ${name}: ${score} at time ${datetime}`
            );
            return {
              name,
              score,
              datetime,
            };
          } else {
            console.log(
              "there's an existing score for this user, don't update"
            );
            return;
          }
        }
      );
    },
    [dayString]
  );

  return [highscores, setHighscoreForUser];
}
