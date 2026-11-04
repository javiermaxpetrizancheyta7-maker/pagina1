import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUp, Heart, Menu, Music, Settings, VolumeX, X } from 'lucide-react';
import { useCoupleSettings } from '@/context/CoupleSettingsContext';
import { useMusic } from '@/context/MusicContext';
import { NAV_SECTIONS } from '@/data/sections';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { openSettings } = useCoupleSettings();
  const { musicOn, toggleMusic } = useMusic();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 24);
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? 'border-b border-blush-200/80 bg-cream-50/90 shadow-sm backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-10">
          <button
            onClick={() => goTo('inicio')}
            className="group flex items-center gap-2 font-display text-lg font-semibold text-ink-900 transition duration-300 hover:text-cherry-600"
          >
            <Heart className="h-5 w-5 fill-cherry-500 text-cherry-600 transition duration-300 group-hover:scale-110" />
            Nuestro universo
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleMusic}
              aria-label={musicOn ? 'Desactivar música' : 'Activar música'}
              title={musicOn ? 'Desactivar música' : 'Activar música'}
              className="btn-icon"
            >
              {musicOn ? <Music className="h-5 w-5 text-cherry-600" /> : <VolumeX className="h-5 w-5" />}
            </button>
            <button onClick={openSettings} aria-label="Ajustes" title="Ajustes" className="btn-icon">
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="btn-secondary ml-1 px-4 py-2"
            >
              <Menu className="h-4 w-4" />
              Menú
            </button>
          </div>
        </div>
        <div className="h-0.5 bg-transparent">
          <div className="h-full bg-gradient-to-r from-blush-400 to-cherry-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <NavOverlay open={menuOpen} onClose={() => setMenuOpen(false)}>
        <nav aria-label="Secciones" className="grid gap-2 sm:grid-cols-2">
          {NAV_SECTIONS.map((section, index) => (
            <button
              key={section.id}
              onClick={() => goTo(section.id)}
              className="group flex items-center gap-4 rounded-2xl px-4 py-3 text-left transition duration-300 hover:bg-blush-100 active:scale-[0.98]"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-blush-200 transition duration-300 group-hover:bg-cherry-600 group-hover:ring-cherry-600">
                <section.icon className="h-4 w-4 text-cherry-600 transition duration-300 group-hover:text-white" />
              </span>
              <span>
                <span className="block font-display text-xl font-semibold text-ink-900">{section.label}</span>
                <span className="block text-xs text-ink-600">{section.hint}</span>
              </span>
            </button>
          ))}
        </nav>
        <button onClick={() => goTo('inicio')} className="btn-secondary mt-6 w-full">
          <ArrowUp className="h-4 w-4" />
          Volver al inicio
        </button>
      </NavOverlay>
    </>
  );
}

interface NavOverlayProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function NavOverlay({ open, onClose, children }: NavOverlayProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center p-4 pt-20">
      <div className="absolute inset-0 bg-ink-900/35 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-2xl animate-scale-in rounded-3xl border border-blush-200 bg-cream-50 p-6 shadow-2xl md:p-8">
        <div className="mb-5 flex items-center justify-between">
          <p className="eyebrow">Recorrido</p>
          <button onClick={onClose} aria-label="Cerrar menú" className="btn-icon">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
