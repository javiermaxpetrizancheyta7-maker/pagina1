import { ArrowUp, Heart } from 'lucide-react';
import { useCoupleSettings } from '@/context/CoupleSettingsContext';

export default function Footer() {
  const { settings } = useCoupleSettings();
  const names = [settings.nameA, settings.nameB].filter(Boolean).join(' & ');

  const backToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative z-10 px-5 pb-16 pt-10 text-center md:px-10">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6">
        <Heart className="h-6 w-6 fill-cherry-500 text-cherry-600" />
        <p className="font-display text-2xl italic text-ink-800">
          {names ? `${names}, siempre juntos.` : 'Siempre juntos.'}
        </p>
        <button onClick={backToTop} className="btn-secondary">
          <ArrowUp className="h-4 w-4" />
          Volver al inicio
        </button>
      </div>
    </footer>
  );
}
