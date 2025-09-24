'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';

type OutcomeViewProps = {
  outcome: 'SUCCESS' | 'FAIL';
  feedback: string;
  mediaUrl: string;
};

export function OutcomeView({ outcome, feedback, mediaUrl }: OutcomeViewProps) {
  const isSuccess = outcome === 'SUCCESS';
  
  return (
    <Card className="max-w-2xl mx-auto w-full shadow-2xl border-0 overflow-hidden">
      <CardHeader className={`flex flex-row items-center gap-4 p-4 ${isSuccess ? 'bg-green-500' : 'bg-destructive'}`}>
        {isSuccess ? (
          <CheckCircle2 className="w-8 h-8 text-white" />
        ) : (
          <XCircle className="w-8 h-8 text-white" />
        )}
        <CardTitle className="font-headline text-3xl text-white">
          {isSuccess ? '¡Éxito!' : 'Fracaso'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video relative w-full overflow-hidden">
           <Image src={mediaUrl} alt={feedback} fill className="object-cover" data-ai-hint={isSuccess ? 'success celebration' : 'failure disappointment'} />
        </div>
        <div className="p-6 bg-background">
          <p className="text-center text-lg font-body text-foreground/90">
            "{feedback}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
