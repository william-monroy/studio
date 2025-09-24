'use client';

import { motion } from 'framer-motion';
import { Gamepad2, BrainCircuit } from 'lucide-react';
import { NicknameForm } from './nickname-form';

export default function HomeClient() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-accent/50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center items-center gap-4 mb-4">
            <BrainCircuit className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-tighter">
                DecisionVerse
            </h1>
        </div>

        <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto font-body">
          Un juego de decisiones rápidas y consecuencias. ¿Tienes lo que se necesita para liderar la tabla de posiciones?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-md mt-10"
      >
        <NicknameForm />
      </motion.div>
    </main>
  );
}
