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
import { Progress } from '@/components/ui/progress';


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

      const gameAnswerTemplate: Omit<GameAnswer, 'outcome'> = {
        questionId: currentQuestion.id,
        decision,
        timeMs: timeTakenMs,
      };

      // Set status to evaluating immediately to provide user feedback
      answerQuestion(gameAnswerTemplate);

      const result = await evaluateAnswer(currentQuestion, decision, nickname);

      const fullAnswer: GameAnswer = { ...gameAnswerTemplate, outcome: result.outcome as 'SUCCESS' | 'FAIL' };
      
      // Update the store with the final outcome
      useGameStore.setState(state => {
        const newAnswers = state.answers.map(a => a.questionId === fullAnswer.questionId ? fullAnswer : a);
        const newScore = newAnswers.filter(a => a.outcome === 'SUCCESS').length;
        return { answers: newAnswers, score: newScore };
      });

      setOutcome({
        outcome: result.outcome as 'SUCCESS' | 'FAIL',
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
      }, 10000); 
    },
    [status, nickname, currentQuestion, answerQuestion, showOutcome, nextQuestion, finishGame, router, currentQuestionIndex, questions.length]
  );
  
  const progressValue = useMemo(() => {
    if (!questions.length) return 0;
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [currentQuestionIndex, questions.length]);

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
    <div className="w-full min-h-screen bg-gradient-to-b from-background to-accent/30 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <Progress value={progressValue} className="fixed top-0 left-0 right-0 h-1 sm:h-2 w-full rounded-none z-50" />
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
