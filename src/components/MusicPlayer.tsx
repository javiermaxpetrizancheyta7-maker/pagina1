import { Pause, Play, Volume1, Volume2 } from 'lucide-react';
import { useMusic } from '@/context/MusicContext';

export default function MusicPlayer() {
  const { musicOn, volume, togglePlaying, changeVolume } = useMusic();
  const percent = Math.round(volume * 100);

  return (
    <div className="animate-fade-in fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-full border border-blush-200 bg-cream-50/90 p-1.5 pr-3 shadow-lg backdrop-blur-xl md:bottom-6 md:left-6">
      <button
        onClick={togglePlaying}
        aria-label={musicOn ? 'Pausar música' : 'Reproducir música'}
        title={musicOn ? 'Pausar música' : 'Reproducir música'}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-cherry-600 text-white shadow-md transition duration-300 hover:bg-cherry-500 active:scale-90"
      >
        {musicOn ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-0.5" />}
      </button>
      <button
        onClick={() => changeVolume(-1)}
        disabled={volume <= 0}
        aria-label="Bajar volumen"
        title="Bajar volumen"
        className="btn-icon disabled:pointer-events-none disabled:opacity-30"
      >
        <Volume1 className="h-5 w-5" />
      </button>
      <span className="w-10 text-center text-xs font-medium tabular-nums text-ink-800" aria-live="polite">
        {percent}%
      </span>
      <button
        onClick={() => changeVolume(1)}
        disabled={volume >= 1}
        aria-label="Subir volumen"
        title="Subir volumen"
        className="btn-icon disabled:pointer-events-none disabled:opacity-30"
      >
        <Volume2 className="h-5 w-5" />
      </button>
    </div>
  );
}
