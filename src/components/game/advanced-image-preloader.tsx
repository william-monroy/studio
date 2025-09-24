'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useImageCache } from '@/hooks/use-image-cache';

interface AdvancedImagePreloaderProps {
  imageUrls: string[];
  onLoaded: () => void;
  title?: string;
  subtitle?: string;
}

export function AdvancedImagePreloader({ 
  imageUrls, 
  onLoaded, 
  title = "Optimizando recursos...",
  subtitle = "Descargando imágenes para una experiencia fluida"
}: AdvancedImagePreloaderProps) {
  const { preloadImages, isLoading, loadedCount, totalCount, progress } = useImageCache();

  useEffect(() => {
    const loadImages = async () => {
      if (imageUrls.length === 0) {
        onLoaded();
        return;
      }

      await preloadImages(imageUrls);
      onLoaded();
    };

    loadImages();
  }, [imageUrls, preloadImages, onLoaded]);

  if (!isLoading && loadedCount === totalCount && totalCount > 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <p className="font-headline text-xl text-green-600">¡Recursos optimizados!</p>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        {/* Icono animado */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <div className="relative">
            <Loader2 className="w-16 h-16 text-primary mx-auto" />
            <ImageIcon className="w-8 h-8 text-primary/60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </motion.div>

        {/* Título y subtítulo */}
        <h2 className="text-2xl font-headline font-bold text-primary mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground mb-6">
          {subtitle}
        </p>

        {/* Barra de progreso */}
        <div className="w-full mb-4">
          <Progress 
            value={progress} 
            className="h-3 bg-accent"
          />
        </div>

        {/* Contador de progreso */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Recursos cargados</span>
          <span className="font-mono">
            {loadedCount} / {totalCount}
          </span>
        </div>

        {/* Porcentaje */}
        <motion.div
          key={Math.floor(progress)}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="mt-2"
        >
          <span className="text-lg font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </motion.div>

        {/* Indicadores de estado */}
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: Math.min(totalCount, 5) }, (_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ 
                scale: i < loadedCount ? 1 : 0.5,
                backgroundColor: i < loadedCount ? '#4B0082' : '#E6E6FA'
              }}
              transition={{ delay: i * 0.1 }}
              className="w-2 h-2 rounded-full"
            />
          ))}
          {totalCount > 5 && (
            <span className="text-xs text-muted-foreground ml-2">
              +{totalCount - 5} más
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
