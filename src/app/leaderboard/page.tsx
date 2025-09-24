'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { LeaderboardTable } from '@/components/game/leaderboard-table';
import { ScoreEntry } from '@/lib/types';
import { getLeaderboard } from '@/lib/actions';
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function LeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Configurar la suscripción en tiempo real a Firestore
    // Ordenamos solo por score en la consulta para evitar el índice compuesto
    // Luego ordenamos por tiempo en memoria
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const leaderboardData: ScoreEntry[] = [];
          querySnapshot.forEach((doc) => {
            leaderboardData.push({ id: doc.id, ...doc.data() } as ScoreEntry);
          });
          
          // Ordenar por score (desc) y luego por tiempo (asc)
          leaderboardData.sort((a, b) => {
            if (a.score !== b.score) {
              return b.score - a.score; // Ordenar por puntuación descendente
            }
            return a.totalTimeMs - b.totalTimeMs; // Si hay empate, ordenar por tiempo ascendente
          });
          
          setScores(leaderboardData);
          setError(null);
        } catch (err) {
          console.error('Error processing leaderboard data:', err);
          setError('Error al cargar el leaderboard. Intenta recargar la página.');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Error subscribing to leaderboard:', error);
        setError('Error al conectar con el servidor. Intenta recargar la página.');
        setIsLoading(false);
      }
    );

    // Limpiar la suscripción al desmontar el componente
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary">
              Clasificación
            </h1>
          </div>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Top jugadores de DecisionVerse
          </p>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Cargando clasificación...</p>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-6 rounded-lg text-center">
              <p className="font-medium">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Recargar página
              </Button>
            </div>
          ) : scores.length > 0 ? (
            <LeaderboardTable scores={scores} />
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border border-dashed">
              <p className="text-muted-foreground">Aún no hay puntuaciones registradas.</p>
              <Link href="/" className="inline-block mt-4">
                <Button variant="outline">
                  <Trophy className="w-4 h-4 mr-2" />
                  ¡Sé el primero en jugar!
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Volver al Juego
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
