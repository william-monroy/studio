import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Question, GameAnswer } from '@/lib/types';

export type GameStatus = 'pending' | 'playing' | 'evaluating' | 'outcome' | 'finished';

type GameState = {
  nickname: string;
  questions: Question[];
  answers: Partial<GameAnswer>[];
  score: number;
  totalTimeMs: number;
  currentQuestionIndex: number;
  status: GameStatus;

  setNickname: (nickname: string) => void;
  startGame: (questions: Question[]) => void;
  answerQuestion: (answer: Partial<GameAnswer>) => void;
  showOutcome: () => void;
  nextQuestion: () => void;
  finishGame: () => void;
  reset: () => void;
};

const initialState = {
  nickname: '',
  questions: [],
  answers: [],
  score: 0,
  totalTimeMs: 0,
  currentQuestionIndex: 0,
  status: 'pending' as GameStatus,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setNickname: (nickname) => set({ nickname }),
      startGame: (questions) =>
        set({
          ...initialState,
          nickname: get().nickname, // Keep nickname from previous state
          questions,
          status: 'playing',
        }),
      answerQuestion: (answer) => {
        set((state) => ({
          status: 'evaluating',
          answers: [...state.answers, answer],
          totalTimeMs: state.totalTimeMs + (answer.timeMs ?? 0),
        }));
      },
      showOutcome: () => set({ status: 'outcome' }),
      nextQuestion: () => {
        const nextIndex = get().currentQuestionIndex + 1;
        if (nextIndex < get().questions.length) {
          set({ currentQuestionIndex: nextIndex, status: 'playing' });
        } else {
          get().finishGame();
        }
      },
      finishGame: () => set({ status: 'finished' }),
      reset: () =>
        set(initialState),
    }),
    {
      name: 'decision-verse-game-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
