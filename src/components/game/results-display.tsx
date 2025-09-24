'use client';

import Confetti from '@/components/confetti';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GameSession } from '@/lib/types';
import { CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export function ResultsDisplay({ session }: { session: GameSession }) {
  const { score, totalTimeMs, answers, questions } = session;
  const accuracy = questions.length > 0 ? (score / questions.length) * 100 : 0;
  const correctAnswers = score;
  const incorrectAnswers = questions.length - score;

  const getMessage = () => {
    if (accuracy === 100) return "¡Dominación total! Eres una leyenda.";
    if (accuracy >= 75) return "¡Excelente! Tus decisiones son de primera.";
    if (accuracy >= 50) return "¡Buen trabajo! Tienes buen instinto.";
    if (accuracy >= 25) return "Estás aprendiendo. ¡Sigue intentando!";
    return "El camino al éxito está lleno de fracasos. ¡No te rindas!";
  }

  return (
    <>
      {accuracy >= 75 && <Confetti />}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <Card className="text-center shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-4xl md:text-5xl text-primary">
              ¡Juego Terminado!
            </CardTitle>
            <p className="text-muted-foreground text-lg">{getMessage()}</p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="bg-primary/10">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 font-headline"><Trophy className="text-yellow-500" />Puntaje Final</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold font-mono text-primary">{score}</p>
                        <p className="text-sm text-muted-foreground">de {questions.length} posibles</p>
                    </CardContent>
                </Card>
            </motion.div>
             <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Card className="bg-accent">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 font-headline"><CheckCircle className="text-green-500" />Aciertos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold font-mono text-foreground">{correctAnswers}</p>
                        <p className="text-sm text-muted-foreground">({accuracy.toFixed(0)}% de precisión)</p>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Card className="bg-accent">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 font-headline"><Clock />Tiempo Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold font-mono text-foreground">{(totalTimeMs / 1000).toFixed(2)}<span className="text-2xl">s</span></p>
                        <p className="text-sm text-muted-foreground">promedio por pregunta: {((totalTimeMs/questions.length)/1000).toFixed(2)}s</p>
                    </CardContent>
                </Card>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
