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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="w-full shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4 sm:pb-6">
          <CardDescription className="font-headline text-sm sm:text-base text-muted-foreground">
            Pregunta {questionNumber} de {totalQuestions}
          </CardDescription>
          <CardTitle className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl pt-2 leading-tight px-2">
            {question.text}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Timer Section - Optimized for mobile */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Progress 
                value={progress} 
                className="h-2 sm:h-3 flex-1" 
              />
              <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-primary">
                  {count}
                </span>
                <span className="text-xs text-muted-foreground">segundos</span>
              </div>
            </div>
            
            {/* Keyboard hint - Hidden on small screens */}
            <p className="text-xs sm:text-sm text-muted-foreground text-center hidden sm:block">
              Usa las teclas{' '}
              <kbd className="px-2 py-1 text-xs font-semibold bg-muted border rounded">Y</kbd>
              {' '}para Sí y{' '}
              <kbd className="px-2 py-1 text-xs font-semibold bg-muted border rounded">N</kbd>
              {' '}para No.
            </p>
            
            {/* Mobile hint */}
            <p className="text-xs text-muted-foreground text-center sm:hidden">
              Toca los botones para responder
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 sm:pt-6 pb-6 sm:pb-8">
          {/* Mobile-first button layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {/* YES Button */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="order-1"
            >
              <Button
                className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold bg-green-500 hover:bg-green-600 text-white shadow-lg active:shadow-md transition-all duration-200"
                onClick={() => handleDecision('YES')}
              >
                <ThumbsUp className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                <span>Sí</span>
              </Button>
            </motion.div>
            
            {/* NO Button */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="order-2"
            >
              <Button
                className="w-full h-14 sm:h-16 text-base sm:text-lg font-semibold shadow-lg active:shadow-md transition-all duration-200"
                variant="destructive"
                onClick={() => handleDecision('NO')}
              >
                <ThumbsDown className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                <span>No</span>
              </Button>
            </motion.div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
