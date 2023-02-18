import React, { useEffect, useState } from "react";
import { Panel } from "./panels/Panel";
import Modal from "react-modal";
import { sortBy } from "lodash";
import { Guess } from "../domain/guess";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { HighscoreEntry, Score } from "../domain/score";
import { useHighscoreDatabase } from "../hooks/useHighscoreDatabase";
import { getDayString } from "../hooks/useTodays";

interface HighscoreProps {
  guesses: Guess[];
}

export function Highscore({ guesses }: HighscoreProps) {
  const [username, setUsername] = useLocalStorage("username", "");
  const [userId, setUserId] = useLocalStorage("userId", "");

  const score: Score = guesses.some((guess) => guess.distance === 0)
    ? guesses.length
    : "X";
  const highscore = {
    userId,
    name: username,
    score,
    editable: true,
  };

  const [highscoreOpen, setHighscoreOpen] = useState(false);

  const [openHighscoreAutomatically, setOpenHighscoreAutomatically] =
    useLocalStorage("openHighscoreAutomatically", "please do");

  useEffect(() => {
    if (openHighscoreAutomatically) {
      setTimeout(() => setHighscoreOpen(true), 3500);
    }
  }, [openHighscoreAutomatically]);

  const highscoreClicked = () => {
    setHighscoreOpen(true);
  };
  const initUserId = () => {
    if (!userId) {
      const userId = Math.random().toString(36).slice(2);
      setUserId(userId);
    }
  };
  const askUsernameSubmit = (username: string) => {
    setOpenHighscoreAutomatically("");
    setUsername(username);
    initUserId();
  };
  const askUsernameCancel = () => {
    setOpenHighscoreAutomatically("");
    setHighscoreOpen(false);
  };

  const [highscores, setHighscoreForUser] = useHighscoreDatabase();
  let highscoresWithEditable = highscores.map((highscore) => {
    const editable = highscore.userId === userId;
    return { ...highscore, editable };
  });
  highscoresWithEditable = sortBy(highscoresWithEditable, "score");
  console.log("yo", highscoresWithEditable[highscoresWithEditable.length - 1]);

  // submit score to backend
  useEffect(() => {
    const today = getDayString();
    if (userId && username && score && today) {
      console.log(`Saving score for ${username}: ${score}`);
      setHighscoreForUser(userId, username, score, today);
    }
  }, [userId, username, score, setHighscoreForUser]);

  return (
    <div>
      <Panel
        title={"High score"}
        isOpen={highscoreOpen}
        close={() => setHighscoreOpen(false)}
      >
        {!username && (
          <AskUsername
            onSubmit={askUsernameSubmit}
            onCancel={askUsernameCancel}
          />
        )}
        <div className="text-lg">
          <p>Today&apos;s high score:</p>
          <div className="flex flex-col items-center">
            {highscoresWithEditable.map((highscore, i) => {
              const boldClass = highscore.editable ? "font-bold" : "";

              const name = highscore.name;
              return (
                <div
                  className={`inline-block flex justify-between w-80 ${boldClass}`}
                  key={highscore.userId}
                >
                  <div>
                    {i + 1}. {name}
                  </div>
                  <div>{highscore.score}/6</div>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>
      <button
        className="rounded font-bold border-2 p-1 uppercase bg-green-600 hover:bg-green-500 active:bg-green-700 text-white w-full"
        onClick={highscoreClicked}
      >
        High score
      </button>
    </div>
  );
}

interface AskUsernameProps {
  onSubmit: (value: string) => void;
  onCancel: () => void;
}
function AskUsername({ onSubmit, onCancel }: AskUsernameProps) {
  const [localUsername, setLocalUsername] = useState("");
  const [show, setShow] = useState(true);

  const save = () => {
    onSubmit(localUsername);
    setShow(false);
  };
  const cancel = () => {
    onCancel();
    setShow(false);
  };

  if (!show) {
    return <div></div>;
  } else {
    return (
      <Modal isOpen={show} onRequestClose={cancel} ariaHideApp={false}>
        <div className="flex flex-col justify-center items-center content-center">
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <h2 className="text-xl font-bold">Well done!</h2>
            <br />
            <p>You made it to the high score board!</p>
            <br />
            <p>What is your name?</p>
            <form onSubmit={save}>
              <input
                type="text"
                value={localUsername}
                placeholder="Your name"
                onChange={(e) => setLocalUsername(e.target.value)}
                className="border font-bold"
                autoFocus
              />
              <div>
                <input type="submit" className="p-2 border m-2" value="Save" />
                <button className="p-2 border m-2" onClick={cancel}>
                  Dismiss
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    );
  }
}
