import { useMemo, useState } from 'react';
import { Camera, Plus } from 'lucide-react';
import Section from '@/components/Section';
import { usePersistentState } from '@/hooks/usePersistentState';
import { formatLongDate } from '@/lib/dates';
import { createId } from '@/lib/id';
import MemoryDialog from '@/sections/memories/MemoryDialog';
import MemoryLightbox from '@/sections/memories/MemoryLightbox';
import type { Memory } from '@/types';

const TILT_CLASSES = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', 'rotate-0', '-rotate-1'];

interface DialogState {
  memory: Memory;
  isNew: boolean;
}

export default function MemoriesSection() {
  const [memories, saveMemories] = usePersistentState<Memory[]>('pu:memories', []);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...memories].sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999')),
    [memories],
  );
  const openIndex = sorted.findIndex((m) => m.id === openId);

  const upsert = (memory: Memory): boolean => {
    const exists = memories.some((m) => m.id === memory.id);
    const next = exists ? memories.map((m) => (m.id === memory.id ? memory : m)) : [...memories, memory];
    return saveMemories(next);
  };

  const remove = (memory: Memory) => {
    if (!window.confirm('¿Seguro que quieres eliminar este recuerdo?')) return;
    if (!saveMemories(memories.filter((m) => m.id !== memory.id))) {
      window.alert('No se pudo eliminar el recuerdo. Intenta de nuevo.');
      return;
    }
    setOpenId(null);
  };

  const openNew = () =>
    setDialog({ memory: { id: createId(), photo: '', date: '', description: '' }, isNew: true });

  return (
    <Section
      id="recuerdos"
      eyebrow="Capítulo dos"
      title="Nuestros recuerdos"
      description="Fotografías que guardan risas, viajes y pequeños instantes que no queremos olvidar."
      icon={Camera}
    >
      {sorted.length > 0 ? (
        <>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((memory, index) => (
              <button
                key={memory.id}
                onClick={() => setOpenId(memory.id)}
                className={`group relative mx-auto w-full max-w-sm rounded-sm bg-white p-4 pb-16 text-left shadow-[0_18px_40px_-18px_rgba(58,42,47,0.45)] ring-1 ring-dusty-100 transition duration-500 ease-out hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.03] hover:shadow-[0_30px_60px_-20px_rgba(58,42,47,0.5)] ${
                  TILT_CLASSES[index % TILT_CLASSES.length]
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-blush-100">
                  <img
                    src={memory.photo}
                    alt={memory.description || 'Recuerdo'}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink-900/30 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                </div>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="font-display text-lg italic text-dusty-700">
                    {memory.date ? formatLongDate(memory.date) : 'Un día especial'}
                  </p>
                  {memory.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-ink-600">{memory.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-16 text-center">
            <button onClick={openNew} className="btn-primary">
              <Plus className="h-4 w-4" />
              Agregar un recuerdo
            </button>
          </div>
        </>
      ) : (
        <div className="card mx-auto max-w-xl p-10 text-center">
          <Camera className="mx-auto h-10 w-10 text-cherry-600" />
          <p className="mt-4 text-lg text-ink-700">Todavía no hay fotografías en nuestro álbum.</p>
          <button onClick={openNew} className="btn-primary mt-6">
            <Plus className="h-4 w-4" />
            Subir la primera foto
          </button>
        </div>
      )}

      {openIndex >= 0 && (
        <MemoryLightbox
          memories={sorted}
          index={openIndex}
          onIndexChange={(next) => setOpenId(sorted[next].id)}
          onClose={() => setOpenId(null)}
          onEdit={(memory) => {
            setOpenId(null);
            setDialog({ memory, isNew: false });
          }}
          onDelete={remove}
        />
      )}

      {dialog && (
        <MemoryDialog
          key={dialog.memory.id}
          memory={dialog.memory}
          isNew={dialog.isNew}
          onClose={() => setDialog(null)}
          onSave={upsert}
        />
      )}
    </Section>
  );
}
