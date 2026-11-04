import { useState } from 'react';
import { BookHeart, ChevronLeft, ChevronRight, Pencil, Plus } from 'lucide-react';
import Section from '@/components/Section';
import { DEFAULT_STORY } from '@/data/defaults';
import { usePersistentState } from '@/hooks/usePersistentState';
import { createId } from '@/lib/id';
import MomentDialog from '@/sections/story/MomentDialog';
import type { StoryMoment } from '@/types';

interface DialogState {
  moment: StoryMoment;
  isNew: boolean;
}

export default function StorySection() {
  const [moments, saveMoments] = usePersistentState<StoryMoment[]>('pu:story', DEFAULT_STORY);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const selectedIndex = Math.max(0, moments.findIndex((m) => m.id === selectedId));
  const active = moments[selectedIndex];

  const select = (index: number) => {
    const next = moments[index];
    if (next) setSelectedId(next.id);
  };

  const openNew = () =>
    setDialog({ moment: { id: createId(), title: '', date: '', text: '' }, isNew: true });

  const upsert = (moment: StoryMoment): boolean => {
    const exists = moments.some((m) => m.id === moment.id);
    const next = exists ? moments.map((m) => (m.id === moment.id ? moment : m)) : [...moments, moment];
    const saved = saveMoments(next);
    if (saved) setSelectedId(moment.id);
    return saved;
  };

  const remove = (id: string): boolean => {
    const index = moments.findIndex((m) => m.id === id);
    const next = moments.filter((m) => m.id !== id);
    const saved = saveMoments(next);
    if (saved) setSelectedId(next[Math.min(index, next.length - 1)]?.id ?? null);
    return saved;
  };

  return (
    <Section
      id="historia"
      eyebrow="Capítulo uno"
      title="Nuestra historia"
      description="Cada momento que nos trajo hasta aquí, en orden y con todo el cariño del mundo."
      icon={BookHeart}
    >
      {active ? (
        <div className="space-y-10">
          <div className="-mx-5 overflow-x-auto px-5 pb-4 pt-2 md:mx-0 md:px-0">
            <ol className="relative flex min-w-max items-start gap-4 md:min-w-0 md:justify-between">
              <span className="absolute left-6 right-6 top-6 h-px bg-gradient-to-r from-blush-300 via-cherry-400 to-blush-300" />
              {moments.map((moment, index) => {
                const selected = index === selectedIndex;
                return (
                  <li key={moment.id} className="relative z-10 flex w-36 flex-col items-center text-center md:w-auto md:flex-1">
                    <button
                      onClick={() => select(index)}
                      aria-current={selected ? 'step' : undefined}
                      className={`flex h-12 w-12 items-center justify-center rounded-full font-display text-lg font-semibold transition-all duration-500 ${
                        selected
                          ? 'scale-110 bg-cherry-600 text-white shadow-xl shadow-cherry-600/30 ring-4 ring-blush-200'
                          : 'bg-white text-cherry-600 shadow-md ring-1 ring-blush-300 hover:-translate-y-1 hover:ring-cherry-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                    <span
                      className={`mt-4 px-2 text-sm leading-snug transition duration-300 ${
                        selected ? 'font-medium text-ink-900' : 'text-ink-600'
                      }`}
                    >
                      {moment.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <article key={active.id} className="card relative mx-auto max-w-3xl animate-scale-in p-8 md:p-12">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {active.date && <p className="eyebrow text-dusty-600">{active.date}</p>}
                <h3 className="mt-2 text-3xl font-semibold text-ink-900 md:text-4xl">{active.title}</h3>
              </div>
              <button
                onClick={() => setDialog({ moment: active, isNew: false })}
                className="btn-secondary self-start"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>
            </div>
            <p className="mt-6 whitespace-pre-line text-lg leading-[1.75] text-ink-800">{active.text}</p>

            <div className="mt-10 flex items-center justify-between border-t border-blush-200 pt-6">
              <button
                onClick={() => select(selectedIndex - 1)}
                disabled={selectedIndex === 0}
                className="btn-icon disabled:pointer-events-none disabled:opacity-30"
                aria-label="Momento anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-ink-600">
                {selectedIndex + 1} de {moments.length}
              </span>
              <button
                onClick={() => select(selectedIndex + 1)}
                disabled={selectedIndex === moments.length - 1}
                className="btn-icon disabled:pointer-events-none disabled:opacity-30"
                aria-label="Momento siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </article>

          <div className="text-center">
            <button onClick={openNew} className="btn-primary">
              <Plus className="h-4 w-4" />
              Agregar un momento
            </button>
          </div>
        </div>
      ) : (
        <div className="card mx-auto max-w-xl p-10 text-center">
          <p className="text-lg text-ink-700">Aún no hay momentos en nuestra historia.</p>
          <button onClick={openNew} className="btn-primary mt-6">
            <Plus className="h-4 w-4" />
            Agregar el primer momento
          </button>
        </div>
      )}

      {dialog && (
        <MomentDialog
          key={dialog.moment.id}
          moment={dialog.moment}
          isNew={dialog.isNew}
          onClose={() => setDialog(null)}
          onSave={upsert}
          onDelete={() => remove(dialog.moment.id)}
        />
      )}
    </Section>
  );
}
