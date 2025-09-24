'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useImageCache } from '@/hooks/use-image-cache';

type OutcomeViewProps = {
  outcome: 'SUCCESS' | 'FAIL';
  feedback: string;
  mediaUrl: string;
};

export function OutcomeView({ outcome, feedback, mediaUrl }: OutcomeViewProps) {
  const isSuccess = outcome === 'SUCCESS';
  const { getCachedUrl } = useImageCache();
  
  // Usar la URL cacheada si está disponible
  const optimizedMediaUrl = getCachedUrl(mediaUrl);
  
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
      <Card className="w-full shadow-2xl border-0 overflow-hidden bg-card/95 backdrop-blur-sm">
        <CardHeader className={`flex flex-row items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 ${isSuccess ? 'bg-green-500' : 'bg-destructive'}`}>
          {isSuccess ? (
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
          )}
          <CardTitle className="font-headline text-xl sm:text-2xl md:text-3xl text-white text-center">
            {isSuccess ? '¡Éxito!' : 'Fracaso'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Media Section - Responsive aspect ratio */}
          <div className="aspect-video sm:aspect-[16/10] md:aspect-video relative w-full overflow-hidden">
            <Image 
              src={optimizedMediaUrl} 
              alt={feedback} 
              fill 
              className="object-cover" 
              data-ai-hint={isSuccess ? 'success celebration' : 'failure disappointment'}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
          </div>
          
          {/* Feedback Section - Mobile optimized */}
          <div className="p-4 sm:p-6 md:p-8 bg-background">
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-sm sm:text-base md:text-lg font-body text-foreground/90 leading-relaxed">
                <span className="text-2xl sm:text-3xl text-primary">"</span>
                {feedback}
                <span className="text-2xl sm:text-3xl text-primary">"</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
