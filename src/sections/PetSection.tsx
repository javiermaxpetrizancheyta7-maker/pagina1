import { useEffect, useReducer, useState, type CSSProperties } from 'react';
import { Apple, Hand, Heart, Sparkles } from 'lucide-react';
import Section from '@/components/Section';
import { DEFAULT_PET } from '@/data/defaults';
import { usePersistentState } from '@/hooks/usePersistentState';
import PetCharacter, { type PetMood } from '@/sections/pet/PetCharacter';
import type { PetState } from '@/types';

const PET_NAME = 'Mochi';
const FULLNESS_LOSS_PER_MINUTE = 0.35;
const AFFECTION_LOSS_PER_MINUTE = 0.12;
const FEED_GAIN = 25;
const PET_GAIN = 8;

const FEED_MESSAGES = [
  '¡Mmm, qué rico! Gracias, amor.',
  'Me siento con energía para bailar contigo.',
  '¡Ñam! Mi corazoncito está contento.',
];
const PET_MESSAGES = [
  'Qué bonito se siente tu cariño.',
  'Ronroneo de felicidad, no pares.',
  `¡${PET_NAME} te quiere muchísimo!`,
];
const SAD_MESSAGES = ['Tengo un poquito de hambre... y de cariño.', 'Ven a visitarme, te extrañé.'];

const clamp = (value: number) => Math.min(100, Math.max(0, value));

function decay(pet: PetState, now: number): PetState {
  if (pet.updatedAt === 0) return pet;
  const minutes = Math.max(0, (now - pet.updatedAt) / 60000);
  return {
    fullness: clamp(pet.fullness - minutes * FULLNESS_LOSS_PER_MINUTE),
    affection: clamp(pet.affection - minutes * AFFECTION_LOSS_PER_MINUTE),
    updatedAt: pet.updatedAt,
  };
}

function moodFrom(happiness: number): PetMood {
  if (happiness >= 70) return 'radiante';
  if (happiness >= 40) return 'tranquila';
  return 'triste';
}

const MOOD_LABEL: Record<PetMood, string> = {
  radiante: 'Radiante',
  tranquila: 'Tranquila',
  triste: 'Necesita cariño',
};

const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];

interface Action {
  kind: 'feed' | 'pet';
  id: number;
  message: string;
}

export default function PetSection() {
  const [stored, saveStored] = usePersistentState<PetState>('pu:pet', DEFAULT_PET);
  const [, tick] = useReducer((n: number) => n + 1, 0);
  const [action, setAction] = useState<Action | null>(null);

  useEffect(() => {
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  const pet = decay(stored, Date.now());
  const happiness = Math.round(pet.fullness * 0.5 + pet.affection * 0.5);
  const mood = moodFrom(happiness);

  const interact = (kind: 'feed' | 'pet') => {
    const now = Date.now();
    const base = decay(stored, now);
    const next: PetState =
      kind === 'feed'
        ? { fullness: clamp(base.fullness + FEED_GAIN), affection: clamp(base.affection + 3), updatedAt: now }
        : { fullness: base.fullness, affection: clamp(base.affection + PET_GAIN), updatedAt: now };
    if (!saveStored(next)) return;
    const message = kind === 'feed' ? pick(FEED_MESSAGES) : pick(PET_MESSAGES);
    setAction({ kind, id: now, message });
  };

  const idleMessage = mood === 'triste' ? pick(SAD_MESSAGES) : null;
  const bubble = action?.message ?? idleMessage ?? `${PET_NAME} está de buen humor. ¿Lo acompañas?`;

  return (
    <Section
      id="mascota"
      eyebrow="Capítulo siete"
      title={`Nuestra mascota, ${PET_NAME}`}
      description="Una pequeña compañera que siente cada detalle. Aliméntala y acaríciala para verla feliz."
      icon={Heart}
    >
      <div className="card mx-auto grid max-w-4xl items-center gap-10 p-8 md:grid-cols-2 md:p-12">
        <div className="relative mx-auto w-full max-w-[260px]">
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blush-100 to-blush-300 opacity-70 blur-2xl" />
          <div key={action?.id ?? 'idle'} className={`relative aspect-square ${action?.kind === 'feed' ? 'animate-wiggle' : action ? 'animate-heartbeat' : ''}`}>
            <PetCharacter mood={mood} />
            {action?.kind === 'pet' &&
              [0, 1, 2, 3].map((i) => (
                <Heart
                  key={i}
                  className="absolute left-1/2 top-1/3 h-5 w-5 animate-rise fill-cherry-500 text-cherry-500"
                  style={{
                    '--dx': `${(i - 1.5) * 34}px`,
                    animationDelay: `${i * 120}ms`,
                  } as CSSProperties}
                />
              ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-cream-100 p-5 ring-1 ring-blush-200">
            <p key={bubble} className="animate-fade-in font-display text-xl italic leading-relaxed text-ink-800">
              “{bubble}”
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-ink-800">Felicidad</span>
              <span className="text-ink-600">
                {happiness}% · {MOOD_LABEL[mood]}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-blush-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blush-400 to-cherry-500 transition-all duration-700 ease-out"
                style={{ width: `${happiness}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-ink-600">
              <StatBar label="Alimentada" value={pet.fullness} />
              <StatBar label="Cariño" value={pet.affection} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => interact('feed')} className="btn-secondary group py-3">
              <Apple className="h-4 w-4 text-cherry-600 transition duration-300 group-hover:-rotate-12" />
              Alimentar a {PET_NAME}
            </button>
            <button onClick={() => interact('pet')} className="btn-primary group py-3">
              <Hand className="h-4 w-4 transition duration-300 group-hover:scale-110" />
              Acariciar a {PET_NAME}
            </button>
          </div>
          <p className="flex items-center gap-2 text-xs text-dusty-700">
            <Sparkles className="h-3.5 w-3.5" />
            {PET_NAME} extraña tus cuidados con el tiempo; vuelve a visitarla.
          </p>
        </div>
      </div>
    </Section>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span className="block text-xs">{label}</span>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-blush-100">
        <div className="h-full rounded-full bg-dusty-400 transition-all duration-700" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
