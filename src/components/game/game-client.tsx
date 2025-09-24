'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/game-store';
import type { GameAnswer } from '@/lib/types';
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

function ImagePreloader({ imageUrls, onLoaded }: { imageUrls: string[], onLoaded: () => void }) {
  useEffect(() => {
    let loadedCount = 0;
    if (imageUrls.length === 0) {
      onLoaded();
      return;
    }

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          onLoaded();
        }
      };
      img.onerror = () => {
        // Even if an image fails, we count it as "loaded" to not block the game
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          onLoaded();
        }
      }
    });
  }, [imageUrls, onLoaded]);

  return null; // This component doesn't render anything
}


export default function GameClient() {
  const router = useRouter();

  const {
    nickname,
    questions,
    currentQuestionIndex,
    status,
    answerQuestion,
    showOutcome,
    nextQuestion,
    finishGame,
  } = useGameStore();

  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Redirect to home if game is not in a playable state
    if (status === 'pending' || questions.length === 0) {
      router.replace('/');
    }
  }, [status, questions, router]);

  const currentQuestion = questions?.[currentQuestionIndex];
  
  const imageUrlsToPreload = useMemo(() => 
    questions.flatMap(q => [q.mediaPosUrl, q.mediaNegUrl]),
  [questions]);

  const handleAnswer = useCallback(
    async (decision: 'YES' | 'NO', timeTakenMs: number) => {
      if (status !== 'playing' || !nickname || !currentQuestion) return;

      const result = await evaluateAnswer(currentQuestion, decision, nickname);

      const gameAnswer: GameAnswer = {
        questionId: currentQuestion.id,
        decision,
        outcome: result.outcome,
        timeMs: timeTakenMs,
      };
      answerQuestion(gameAnswer);

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
        const isFinished = currentQuestionIndex + 1 >= questions.length;
        if (isFinished) {
          finishGame();
          router.push(`/results`);
        } else {
          nextQuestion();
        }
      }, 4000); // Increased outcome view time to 4 seconds
    },
    [status, nickname, currentQuestion, answerQuestion, showOutcome, nextQuestion, finishGame, router, currentQuestionIndex, questions.length]
  );
  
  if (status === 'pending' || !currentQuestion) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 font-headline text-xl">Sincronizando el universo...</p>
      </div>
    );
  }

  if (!imagesLoaded) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-background">
        <ImagePreloader imageUrls={imageUrlsToPreload} onLoaded={() => setImagesLoaded(true)} />
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="mt-4 font-headline text-xl">Optimizando recursos...</p>
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
