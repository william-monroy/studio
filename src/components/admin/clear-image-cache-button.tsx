'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, HardDrive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ClearImageCacheButton() {
  const [isClearing, setIsClearing] = useState(false);
  const { toast } = useToast();

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      // Limpiar el caché del navegador para las imágenes
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      // Recargar la página para limpiar el caché en memoria
      window.location.reload();
      
      toast({
        title: "Caché Limpiado",
        description: "El caché de imágenes se ha limpiado exitosamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo limpiar el caché de imágenes.",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Button
      onClick={handleClearCache}
      disabled={isClearing}
      size="sm"
      variant="outline"
      className="w-full"
    >
      <HardDrive className="mr-2 h-4 w-4" />
      {isClearing ? 'Limpiando...' : 'Limpiar Caché de Imágenes'}
    </Button>
  );
}
