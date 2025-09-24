'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameStore } from '@/store/game-store';

export function useGameSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zustandSessionId = useGameStore((state) => state.sessionId);
  const status = useGameStore((state) => state.status);
  const reset = useGameStore(state => state.reset);
  
  const serverSessionId = searchParams.get('sessionId');

  useEffect(() => {
    // If the game is over, stay on results page
    if (status === 'finished') {
        if(serverSessionId) router.push(`/results/${serverSessionId}`);
        return;
    };
    
    // If there's no session ID in Zustand or URL, or they don't match, redirect to home.
    if (!zustandSessionId || !serverSessionId || zustandSessionId !== serverSessionId) {
      reset();
      router.replace('/');
    }
  }, [zustandSessionId, serverSessionId, router, status, reset]);
}
