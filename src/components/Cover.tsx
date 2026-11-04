import { ArrowRight, Heart } from 'lucide-react';
import { useCoupleSettings } from '@/context/CoupleSettingsContext';

interface CoverProps {
  leaving: boolean;
  onEnter: () => void;
}

export default function Cover({ leaving, onEnter }: CoverProps) {
  const { settings, openSettings } = useCoupleSettings();
  const names = [settings.nameA, settings.nameB].filter(Boolean).join(' & ');

  return (
    <section
      className={`fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream-50 via-blush-100 to-blush-300 px-6 transition-all duration-[1100ms] ease-in-out ${
        leaving ? 'scale-110 opacity-0 blur-sm' : 'scale-100 opacity-100'
      }`}
    >
      <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50 blur-3xl" />

      <div className="relative z-10 max-w-2xl text-center animate-fade-up">
        <div className="relative mx-auto mb-10 flex h-32 w-32 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-cherry-500/10 blur-md" />
          <span className="absolute inset-3 rounded-full border border-cherry-500/20" />
          <Heart className="relative h-20 w-20 animate-heartbeat fill-cherry-500 text-cherry-600 drop-shadow-[0_12px_24px_rgba(154,18,52,0.35)]" />
        </div>

        {names && <p className="eyebrow">{names}</p>}
        <h1 className="mt-5 text-5xl font-semibold leading-[1.1] text-ink-900 md:text-7xl">
          {settings.coverTitle}
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-xl italic leading-relaxed text-dusty-700 md:text-2xl">
          {settings.coverPhrase}
        </p>

        <button
          onClick={onEnter}
          disabled={leaving}
          className="btn-primary group mt-12 px-8 py-4 text-base"
        >
          Entrar a nuestro mundo
          <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
        </button>

        <button
          onClick={openSettings}
          className="mt-6 block w-full text-sm text-dusty-700 underline-offset-4 transition hover:text-cherry-600 hover:underline"
        >
          Personalizar nombres y frases
        </button>
      </div>
    </section>
  );
}
