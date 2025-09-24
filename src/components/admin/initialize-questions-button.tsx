'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { initializeQuestionsFields } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export function InitializeQuestionsButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      const result = await initializeQuestionsFields();
      
      if (result.success) {
        toast({
          title: "Inicialización Completada",
          description: result.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error en la Inicialización",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado durante la inicialización.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleInitialize}
      disabled={isLoading}
      size="sm"
      variant="outline"
      className="w-full"
    >
      <Settings className="mr-2 h-4 w-4" />
      {isLoading ? 'Inicializando...' : 'Inicializar Preguntas'}
    </Button>
  );
}
