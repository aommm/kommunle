export type Score = number | "X";

export interface HighscoreEntry {
  score: Score;
  userId: string;
  name: string;
  datetime: string;
  editable?: boolean;
}
