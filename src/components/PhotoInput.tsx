import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { compressImage } from '@/lib/image';

interface PhotoInputProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label: string;
  aspectClass?: string;
}

export default function PhotoInput({ value, onChange, label, aspectClass = 'aspect-[4/3]' }: PhotoInputProps) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await compressImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la imagen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="label">{label}</span>
      <label
        className={`group relative flex ${aspectClass} w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-dusty-300 bg-blush-50 transition duration-300 hover:border-cherry-400 hover:bg-blush-100`}
      >
        {value ? (
          <img src={value} alt="Vista previa" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <span className="flex flex-col items-center gap-2 text-sm text-ink-600">
            <ImagePlus className="h-7 w-7 text-cherry-600" />
            {busy ? 'Preparando la foto...' : 'Toca para elegir una foto'}
          </span>
        )}
        {value && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-ink-900/70 px-4 py-2 text-center text-xs font-medium text-white opacity-0 transition duration-300 group-hover:opacity-100">
            Cambiar foto
          </span>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            void handleFile(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
      </label>
      {error && <p className="mt-2 text-sm text-cherry-600">{error}</p>}
    </div>
  );
}
