import { getGameSession, getLeaderboard } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { ResultsDisplay } from '@/components/game/results-display';
import { LeaderboardTable } from '@/components/game/leaderboard-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gamepad, Home } from 'lucide-radix-icons';

export default async function ResultsPage({ params }: { params: { sessionId: string } }) {
  const session = await getGameSession(params.sessionId);
  const leaderboard = await getLeaderboard();

  if (!session) {
    redirect('/');
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
