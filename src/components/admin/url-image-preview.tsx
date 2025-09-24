'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, AlertCircle } from 'lucide-react';

interface UrlImagePreviewProps {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  onUrlChange?: (url: string) => void;
}

export function UrlImagePreview({ 
  name, 
  label, 
  placeholder, 
  defaultValue = '', 
  onUrlChange 
}: UrlImagePreviewProps) {
  const [url, setUrl] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (url && url !== defaultValue) {
      setIsLoading(true);
      setHasError(false);
      setImageLoaded(false);
    }
  }, [url, defaultValue]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    onUrlChange?.(newUrl);
    if (!newUrl) {
      setIsLoading(false);
      setHasError(false);
      setImageLoaded(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    setImageLoaded(false);
  };

  return (
    <div className="grid gap-3">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={url}
        onChange={(e) => handleUrlChange(e.target.value)}
        placeholder={placeholder}
        className="mb-2"
      />
      
      {/* Preview Area */}
      {url && (
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center min-h-[200px]">
              {isLoading && (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <span className="text-sm">Cargando imagen...</span>
                </div>
              )}
              
              {hasError && (
                <div className="flex flex-col items-center justify-center text-destructive">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <span className="text-sm text-center">
                    Error al cargar la imagen
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Verifica que la URL sea válida
                    </span>
                  </span>
                </div>
              )}
              
              {!url && !isLoading && !hasError && (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8 mb-2" />
                  <span className="text-sm">Vista previa de imagen</span>
                </div>
              )}
              
              {url && (
                <img
                  src={url}
                  alt="Vista previa"
                  className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoaded ? 'block' : 'none' }}
                />
              )}
            </div>
            
            {imageLoaded && (
              <p className="text-xs text-muted-foreground mt-2 truncate">
                {url}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
