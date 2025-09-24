import { Suspense } from "react";
import GameClient from "@/components/game/game-client";
import { getGameSession } from "@/lib/actions";
import { redirect } from 'next/navigation';

function GameLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen text-primary font-headline text-2xl">
            Cargando tu destino...
        </div>
    )
}

export default async function PlayPage({ searchParams }: { searchParams: { sessionId: string } }) {
    const sessionId = searchParams.sessionId;
    if (!sessionId) {
        redirect('/');
    }

    const session = await getGameSession(sessionId);

    if (!session) {
        // This might happen on page refresh if the server restarts and loses the in-memory session.
        // In a real app with a DB, this would be more robust.
        redirect('/');
    }
    
    return (
        <Suspense fallback={<GameLoading />}>
            <GameClient session={session} />
        </Suspense>
    );
}
