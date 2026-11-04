import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import Section from '@/components/Section';
import { REASONS } from '@/data/reasons';
import { usePersistentState } from '@/hooks/usePersistentState';

const TOTAL = REASONS.length;

export default function ReasonsSection() {
  const [seen, saveSeen] = usePersistentState<number[]>('pu:reasons-seen', []);
  const [current, setCurrent] = useState<{ index: number; key: number } | null>(null);

  const seenCount = new Set(seen.filter((i) => i >= 0 && i < TOTAL)).size;
  const completed = seenCount === TOTAL;

  const discover = () => {
    const seenSet = new Set(seen);
    const unseen = REASONS.map((_, i) => i).filter((i) => !seenSet.has(i));
    const pool = unseen.length > 0 ? unseen : REASONS.map((_, i) => i);
    const index = pool[Math.floor(Math.random() * pool.length)];
    const base = unseen.length > 0 ? seen : [];
    if (!saveSeen([...base, index])) return;
    setCurrent({ index, key: (current?.key ?? 0) + 1 });
  };

  const buttonLabel = current ? 'Descubrir otra razón' : 'Descubrir una razón';

  return (
    <Section
      id="razones"
      eyebrow="Capítulo cuatro"
      title="100 razones por las que te amo"
      description="Cada vez que lo pidas aparecerá una razón distinta. No se repiten hasta que las descubras todas."
      icon={Heart}
    >
      <div className="mx-auto max-w-2xl">
        <div className="card relative overflow-hidden p-8 text-center md:p-12">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blush-200/60 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-dusty-200/50 blur-2xl" />

          <div className="relative flex min-h-[190px] flex-col items-center justify-center">
            {current ? (
              <div key={current.key} className="animate-scale-in">
                <span className="eyebrow text-dusty-600">Razón {current.index + 1} de {TOTAL}</span>
                <p className="mt-5 font-display text-2xl font-medium leading-relaxed text-ink-900 md:text-3xl">
                  {REASONS[current.index]}
                </p>
              </div>
            ) : (
              <p className="max-w-md font-display text-2xl italic leading-relaxed text-dusty-700 md:text-3xl">
                Hay cien razones esperando a ser descubiertas. Empieza cuando quieras.
              </p>
            )}
          </div>

          <div className="relative mt-10">
            <div className="mb-3 flex items-center justify-between text-sm text-ink-600">
              <span>Descubiertas</span>
              <span className="font-medium text-ink-800">
                {seenCount} de {TOTAL}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blush-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blush-400 to-cherry-500 transition-all duration-700 ease-out"
                style={{ width: `${(seenCount / TOTAL) * 100}%` }}
              />
            </div>
          </div>

          <button onClick={discover} className="btn-primary group relative mt-10 px-8 py-4">
            <Sparkles className="h-4 w-4 transition duration-500 group-hover:rotate-12 group-hover:scale-110" />
            {buttonLabel}
          </button>

          {completed && (
            <p className="mt-6 text-sm text-dusty-700">
              Ya descubriste las cien razones. Al siguiente clic empezaremos de nuevo.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
