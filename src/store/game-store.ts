import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameSession, Question } from '@/lib/types';

export type GameStatus = 'pending' | 'playing' | 'evaluating' | 'outcome' | 'finished';

type GameState = {
  nickname: string | null;
  sessionId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  status: GameStatus;
  setNickname: (nickname: string) => void;
  startGame: (sessionId: string, questions: Question[]) => void;
  answerQuestion: () => void;
  showOutcome: () => void;
  nextQuestion: () => void;
  finishGame: () => void;
  reset: () => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      nickname: null,
      sessionId: null,
      questions: [],
      currentQuestionIndex: 0,
      status: 'pending',
      setNickname: (nickname) => set({ nickname }),
      startGame: (sessionId, questions) =>
        set({
          sessionId,
          questions,
          currentQuestionIndex: 0,
          status: 'playing',
        }),
      answerQuestion: () => set({ status: 'evaluating' }),
      showOutcome: () => set({ status: 'outcome' }),
      nextQuestion: () => {
        const nextIndex = get().currentQuestionIndex + 1;
        if (nextIndex < get().questions.length) {
          set({ currentQuestionIndex: nextIndex, status: 'playing' });
        } else {
          set({ status: 'finished' });
        }
      },
      finishGame: () => set({ status: 'finished' }),
      reset: () =>
        set({
          nickname: null,
          sessionId: null,
          questions: [],
          currentQuestionIndex: 0,
          status: 'pending',
        }),
    }),
    {
      name: 'decision-verse-game-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
