export type Question = {
  id: string;
  text: string;
  successProb: number;    // 0..1
  timeLimitSec: number;   // p.ej. 10
  mediaPosUrl: string;    // gif/img éxito
  mediaNegUrl: string;    // gif/img fracaso
  active: boolean;
  order: number;          // para ordenar
  updatedAt: number;
};

export type GameAnswer = {
  questionId: string;
  decision: 'YES' | 'NO';
  outcome: 'SUCCESS' | 'FAIL'; // calculado en servidor
  timeMs: number;              // cuánto tardó
};

export type GameSession = {
  id: string;
  nickname: string;
  startedAt: number;
  endedAt?: number;
  answers: GameAnswer[];
  score: number;
  totalTimeMs: number;
  questions: Question[];
  currentQuestionIndex: number;
};

export type ScoreEntry = {
  id?: string;            // leaderboard doc id
  nickname: string;
  score: number;
  totalTimeMs: number;
  createdAt: number;
};
