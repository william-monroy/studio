'use client';

import { getGameSession, getLeaderboard } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { ResultsDisplay } from '@/components/game/results-display';
import { LeaderboardTable } from '@/components/game/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gamepad, Home } from 'lucide-react';
import { GameSession } from '@/lib/types';
import { ScoreEntry } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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


export default function ResultsPage({ params }: { params: { sessionId: string } }) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionData, leaderboardData] = await Promise.all([
          getGameSession(params.sessionId),
          getLeaderboard()
        ]);
        
        if (!sessionData) {
          redirect('/');
          return;
        }

        setSession(sessionData);
        setLeaderboard(leaderboardData);

      } catch (error) {
        console.error("Failed to fetch results data", error);
        redirect('/');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.sessionId]);

  if (loading || !session || !leaderboard) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 min-h-screen">
      <ResultsDisplay session={session} />
      
      <div className="my-12">
        <h2 className="text-4xl font-headline font-bold text-center text-primary mb-6">
          Tabla de Líderes
        </h2>
        <LeaderboardTable scores={leaderboard} currentSessionId={session.id} />
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
        <Button asChild size="lg">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Volver al Inicio
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary">
          <Link href="/">
            <Gamepad className="mr-2 h-5 w-5" />
            Jugar de Nuevo
          </Link>
        </Button>
      </div>
    </div>
  );
}
