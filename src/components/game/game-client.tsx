'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import { useGameSession } from '@/hooks/use-game-session';
import type { GameSession, Question } from '@/lib/types';
import { evaluateAnswer } from '@/lib/actions';

import { QuestionView } from './question-view';
import { OutcomeView } from './outcome-view';
import Confetti from '../confetti';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Outcome = {
  outcome: 'SUCCESS' | 'FAIL';
  feedback: string;
  mediaUrl: string;
};

export default function GameClient({ session }: { session: GameSession }) {
  useGameSession();
  const router = useRouter();

  const {
    sessionId,
    questions,
    currentQuestionIndex,
    status,
    answerQuestion,
    showOutcome,
    nextQuestion,
    finishGame,
    startGame: startGameInStore,
  } = useGameStore();

  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Hydrate store with server-side session data if it's missing
    if (session && !sessionId) {
      startGameInStore(session.id, session.questions);
    }
  }, [session, sessionId, startGameInStore]);

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleAnswer = useCallback(
    async (decision: 'YES' | 'NO', timeTakenMs: number) => {
      if (status !== 'playing' || !sessionId || !currentQuestion) return;

      answerQuestion();
      const result = await evaluateAnswer(sessionId, currentQuestion.id, decision, timeTakenMs);

      setOutcome({
        outcome: result.outcome,
        feedback: result.feedback,
        mediaUrl: result.mediaUrl,
      });

      if (result.outcome === 'SUCCESS') {
        setShowConfetti(true);
      }

      showOutcome();

      setTimeout(() => {
        setShowConfetti(false);
        if (result.isFinished) {
          finishGame();
          router.push(`/results/${sessionId}`);
        } else {
          nextQuestion();
        }
      }, 2500); // Show outcome for 2.5 seconds
    },
    [status, sessionId, currentQuestion, answerQuestion, showOutcome, nextQuestion, finishGame, router]
  );
  
  if (!sessionId || !currentQuestion) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 font-headline text-xl">Sincronizando el universo...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {showConfetti && <Confetti />}
      <AnimatePresence mode="wait">
        {status === 'playing' && (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full"
          >
            <QuestionView
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}
        {status === 'evaluating' && (
           <motion.div
            key="evaluating"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-center"
           >
             <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
             <p className="mt-4 font-headline text-2xl text-primary">Calculando resultado...</p>
           </motion.div>
        )}
        {status === 'outcome' && outcome && (
          <motion.div
            key="outcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className="w-full"
          >
            <OutcomeView {...outcome} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
