import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2, X } from 'lucide-react';
import { formatLongDate } from '@/lib/dates';
import type { Memory } from '@/types';

interface MemoryLightboxProps {
  memories: Memory[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  onEdit: (memory: Memory) => void;
  onDelete: (memory: Memory) => void;
}

export default function MemoryLightbox({
  memories,
  index,
  onIndexChange,
  onClose,
  onEdit,
  onDelete,
}: MemoryLightboxProps) {
  const memory = memories[index];
  const count = memories.length;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % count);
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [count, index, onClose, onIndexChange]);

  if (!memory) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 md:p-10">
      <div className="absolute inset-0 bg-ink-900/85 backdrop-blur-md animate-fade-in" onClick={onClose} />

      <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20">
        <X className="h-6 w-6" />
      </button>

      {count > 1 && (
        <>
          <button
            onClick={() => onIndexChange((index - 1 + count) % count)}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => onIndexChange((index + 1) % count)}
            aria-label="Foto siguiente"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 md:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <figure key={memory.id} className="relative z-10 flex max-h-full w-full max-w-3xl animate-scale-in flex-col items-center">
        <div className="rounded-sm bg-white p-3 pb-6 shadow-2xl sm:p-4 sm:pb-8">
          <img
            src={memory.photo}
            alt={memory.description || 'Recuerdo'}
            className="max-h-[60vh] w-auto max-w-full object-contain"
          />
        </div>
        <figcaption className="mt-6 max-w-xl text-center text-white">
          {memory.date && <p className="font-display text-xl italic text-blush-200">{formatLongDate(memory.date)}</p>}
          {memory.description && <p className="mt-2 leading-relaxed text-white/90">{memory.description}</p>}
        </figcaption>
        <div className="mt-6 flex gap-3">
          <button onClick={() => onEdit(memory)} className="btn-secondary border-white/30 bg-white/90">
            <Pencil className="h-4 w-4" />
            Editar
          </button>
          <button onClick={() => onDelete(memory)} className="btn-secondary border-white/30 bg-white/90 text-cherry-600">
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </figure>
    </div>
  );
}
