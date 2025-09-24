import { Suspense } from "react";
import GameClient from "@/components/game/game-client";

function GameLoading() {
    return (
        <div className="flex items-center justify-center min-h-screen text-primary font-headline text-2xl">
            Cargando tu destino...
        </div>
    )
}

export default async function PlayPage() {
    return (
        <Suspense fallback={<GameLoading />}>
            <GameClient />
        </Suspense>
    );
}
