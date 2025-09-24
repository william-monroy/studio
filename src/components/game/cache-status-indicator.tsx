'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CacheStatusIndicatorProps {
  totalImages: number;
  loadedImages: number;
  showWhenComplete?: boolean;
}

export function CacheStatusIndicator({ 
  totalImages, 
  loadedImages, 
  showWhenComplete = false 
}: CacheStatusIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isComplete = loadedImages >= totalImages;
  const progress = totalImages > 0 ? (loadedImages / totalImages) * 100 : 100;

  useEffect(() => {
    if (isComplete && !showWhenComplete) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, showWhenComplete]);

  if (!isVisible && !showWhenComplete) return null;

  return (
    <AnimatePresence>
      {(isVisible || showWhenComplete) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <Badge 
            variant={isComplete ? "default" : "secondary"}
            className={`flex items-center gap-2 px-3 py-2 ${
              isComplete 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'bg-background/80 backdrop-blur-sm border'
            }`}
          >
            {isComplete ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Imágenes listas</span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Wifi className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium">
                  Caché: {Math.round(progress)}%
                </span>
              </>
            )}
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
