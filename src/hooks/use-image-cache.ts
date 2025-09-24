'use client';

import { useEffect, useState, useCallback } from 'react';

interface ImageCacheEntry {
  url: string;
  blob: Blob;
  objectUrl: string;
  timestamp: number;
}

class ImageCacheManager {
  private cache = new Map<string, ImageCacheEntry>();
  private readonly maxAge = 1000 * 60 * 30; // 30 minutos
  private readonly maxSize = 50; // máximo 50 imágenes en caché

  async preloadImage(url: string): Promise<string> {
    // Verificar si ya está en caché y es válido
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.objectUrl;
    }

    try {
      // Descargar la imagen
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      // Limpiar caché si está lleno
      if (this.cache.size >= this.maxSize) {
        this.cleanOldEntries();
      }

      // Guardar en caché
      this.cache.set(url, {
        url,
        blob,
        objectUrl,
        timestamp: Date.now(),
      });

      return objectUrl;
    } catch (error) {
      console.warn(`Failed to cache image ${url}:`, error);
      // Retornar la URL original si falla el caché
      return url;
    }
  }

  getCachedUrl(url: string): string | null {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.objectUrl;
    }
    return null;
  }

  private cleanOldEntries() {
    const entries = Array.from(this.cache.entries());
    // Ordenar por timestamp (más antiguo primero)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Eliminar las más antiguas hasta llegar al 80% de la capacidad
    const toRemove = Math.ceil(this.maxSize * 0.2);
    for (let i = 0; i < toRemove && entries.length > 0; i++) {
      const [url, entry] = entries[i];
      URL.revokeObjectURL(entry.objectUrl);
      this.cache.delete(url);
    }
  }

  clear() {
    this.cache.forEach(entry => {
      URL.revokeObjectURL(entry.objectUrl);
    });
    this.cache.clear();
  }
}

// Instancia singleton del gestor de caché
const imageCacheManager = new ImageCacheManager();

export interface UseImageCacheReturn {
  preloadImages: (urls: string[]) => Promise<void>;
  getCachedUrl: (url: string) => string;
  isLoading: boolean;
  loadedCount: number;
  totalCount: number;
  progress: number;
}

export function useImageCache(): UseImageCacheReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const preloadImages = useCallback(async (urls: string[]) => {
    if (urls.length === 0) return;

    setIsLoading(true);
    setLoadedCount(0);
    setTotalCount(urls.length);

    const uniqueUrls = [...new Set(urls)]; // Eliminar duplicados
    let completed = 0;

    const promises = uniqueUrls.map(async (url) => {
      try {
        await imageCacheManager.preloadImage(url);
      } catch (error) {
        console.warn(`Failed to preload image: ${url}`, error);
      } finally {
        completed++;
        setLoadedCount(completed);
      }
    });

    await Promise.all(promises);
    setIsLoading(false);
  }, []);

  const getCachedUrl = useCallback((url: string): string => {
    return imageCacheManager.getCachedUrl(url) || url;
  }, []);

  const progress = totalCount > 0 ? (loadedCount / totalCount) * 100 : 0;

  // Limpiar caché al desmontar
  useEffect(() => {
    return () => {
      // No limpiar automáticamente para mantener el caché entre componentes
    };
  }, []);

  return {
    preloadImages,
    getCachedUrl,
    isLoading,
    loadedCount,
    totalCount,
    progress,
  };
}
