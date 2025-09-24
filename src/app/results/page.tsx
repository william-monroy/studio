'use client';

import { saveScore } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { ResultsDisplay } from '@/components/game/results-display';
import { LeaderboardTable } from '@/components/game/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gamepad, Home } from 'lucide-react';
import type { ScoreEntry, GameAnswer } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGameStore } from '@/store/game-store';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function LoadingSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 min-h-screen">
      <Skeleton className="h-64 w-full" />
      <div className="my-12">
        <Skeleton className="h-12 w-1/2 mx-auto mb-6" />
        <Skeleton className="h-80 w-full" />
      </div>
       <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-12 w-48" />
      </div>
    </div>
  )
}


export default function ResultsPage() {
  const router = useRouter();
  const { nickname, score, totalTimeMs, questions, answers, status, reset } = useGameStore();

  const [leaderboard, setLeaderboard] = useState<ScoreEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'finished') {
      router.replace('/');
      return;
    }

    // Save score once when the page loads
    saveScore({ nickname, score, totalTimeMs })
      .catch(error => console.error("Failed to save score", error))
      .finally(() => setLoading(false));

    // Set up real-time listener for the leaderboard (without complex query to avoid index requirement)
    const unsubscribe = onSnapshot(collection(db, 'leaderboard'), (snapshot) => {
        const allScores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ScoreEntry);
        
        // Sort in memory to avoid index requirement
        const sortedScores = allScores.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score; // Higher score first
            }
            if (a.totalTimeMs !== b.totalTimeMs) {
                return a.totalTimeMs - b.totalTimeMs; // Lower time first (faster)
            }
            return b.createdAt - a.createdAt; // More recent first
        }).slice(0, 50); // Limit to top 50
        
        setLeaderboard(sortedScores);
    }, (error) => {
        console.error("Error fetching real-time leaderboard:", error);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [status, router, nickname, score, totalTimeMs]);

  const handlePlayAgain = () => {
    reset();
    router.push('/');
  }

  if (loading || status !== 'finished') {
    return <LoadingSkeleton />;
  }

  const session = {
      id: '',
      nickname,
      score,
      totalTimeMs,
      questions,
      answers: answers.filter((answer): answer is GameAnswer => 
        answer.questionId !== undefined && 
        answer.decision !== undefined && 
        answer.outcome !== undefined && 
        answer.timeMs !== undefined
      ),
      startedAt: 0,
      currentQuestionIndex: 0
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 min-h-screen">
      <ResultsDisplay session={session} />
      
      {leaderboard ? (
        <div className="my-12">
          <h2 className="text-4xl font-headline font-bold text-center text-primary mb-6">
            Tabla de Líderes
          </h2>
          <LeaderboardTable scores={leaderboard} />
        </div>
      ) : (
         <div className="my-12 flex flex-col items-center">
            <Skeleton className="h-12 w-1/2 mx-auto mb-6" />
            <Skeleton className="h-80 w-full" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
        <Button asChild size="lg" onClick={handlePlayAgain}>
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Volver al Inicio
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" onClick={handlePlayAgain}>
          <Link href="/">
            <Gamepad className="mr-2 h-5 w-5" />
            Jugar de Nuevo
          </Link>
        </Button>
      </div>
    </div>
  );
}
