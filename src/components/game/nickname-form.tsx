'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { User, Play } from 'lucide-react';

import { startGame } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameStore } from '@/store/game-store';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Empezando...' : 'Jugar'}
      <Play className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function NicknameForm() {
  const [state, formAction] = useActionState(startGame, { error: null });
  const setNickname = useGameStore((state) => state.setNickname);
  const resetGame = useGameStore((state) => state.reset);
  
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleFormAction = (formData: FormData) => {
    const nickname = formData.get('nickname') as string;
    setNickname(nickname);
    formAction(formData);
  }

  return (
    <Card className="shadow-2xl">
      <form action={handleFormAction}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><User />Crea tu jugador</CardTitle>
          <CardDescription>Ingresa tu nickname para comenzar la aventura.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="Tu nickname épico..."
              required
              minLength={2}
              maxLength={16}
              className="pl-10"
            />
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          {state?.error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm font-medium text-destructive"
            >
              {state.error}
            </motion.p>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
