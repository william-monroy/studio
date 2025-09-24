'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCountdown, useEventListener } from 'usehooks-ts';
import type { Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

type QuestionViewProps = {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (decision: 'YES' | 'NO', timeTakenMs: number) => void;
};

export function QuestionView({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuestionViewProps) {
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: question.timeLimitSec,
    intervalMs: 1000,
    isIncrement: false,
  });

  const [startTime] = useState(Date.now());

  useEffect(() => {
    startCountdown();
    return () => resetCountdown();
  }, [question, startCountdown, resetCountdown]);
  
  const handleDecision = (decision: 'YES' | 'NO') => {
    const timeTaken = Date.now() - startTime;
    onAnswer(decision, timeTaken);
  };
  
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'y') {
      handleDecision('YES');
    } else if (event.key.toLowerCase() === 'n') {
      handleDecision('NO');
    }
  };

  useEventListener('keydown', handleKeyPress);


  useEffect(() => {
    if (count === 0) {
      handleDecision('NO');
    }
  }, [count]);

  const progress = useMemo(() => (count / question.timeLimitSec) * 100, [count, question.timeLimitSec]);

  return (
    <Card className="max-w-2xl mx-auto w-full shadow-2xl border-primary/20">
      <CardHeader>
        <CardDescription className="font-headline">
          Pregunta {questionNumber} de {totalQuestions}
        </CardDescription>
        <CardTitle className="font-headline text-3xl pt-2">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Progress value={progress} className="h-3" />
            <span className="font-mono text-lg font-bold text-primary w-12 text-center">{count}s</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Usa las teclas <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Y</kbd> para Sí y <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">N</kbd> para No.
          </p>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="w-full text-lg h-16 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => handleDecision('YES')}
          >
            <ThumbsUp className="mr-2" /> Sí
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            className="w-full text-lg h-16"
            variant="destructive"
            onClick={() => handleDecision('NO')}
          >
            <ThumbsDown className="mr-2" /> No
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
}
