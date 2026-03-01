import { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Camera, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';

export function PrescriptionUpload() {
  const { register, setValue, watch } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const prescriptionPath = watch('prescription_path');

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        setPreview(null);
        setValue('prescription_path', '');
        setValue('prescription_file', null);
        return;
      }
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      setValue('prescription_file', file);
      setValue('prescription_path', file.name);
      setUploadProgress(100);
    },
    [setValue]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      handleFile(file ?? null);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    handleFile(null);
    setUploadProgress(0);
  }, [handleFile]);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'relative flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="hidden"
          {...register('prescription_path')}
        />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={handleChange}
          aria-label="Téléverser une photo d'ordonnance"
        />
        {preview ? (
          <div className="relative w-full max-w-sm">
            <img
              src={preview}
              alt="Aperçu ordonnance"
              className="rounded-lg border border-border object-contain max-h-64 w-full bg-card"
            />
            <div className="mt-2 flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
                <RefreshCw className="size-4" />
                Reprendre la photo
              </Button>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <ProgressBar value={uploadProgress} className="mt-2" showLabel />
            )}
          </div>
        ) : (
          <>
            <Camera className="size-12 text-muted-foreground" aria-hidden />
            <p className="mt-2 text-center text-sm font-medium text-foreground">
              Glissez une photo ici ou cliquez pour prendre une photo
            </p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Bonne luminosité ✓ · Texte lisible ✓
            </p>
          </>
        )}
      </div>
    </div>
  );
}
