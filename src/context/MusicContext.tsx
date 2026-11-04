import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import BackgroundMusic from '@/components/BackgroundMusic';

const VOLUME_STEP = 0.1;

interface MusicContextValue {
  musicOn: boolean;
  volume: number;
  start: () => void;
  togglePlaying: () => void;
  changeVolume: (direction: 1 | -1) => void;
  setSongPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicOn, setMusicOn] = useState(false);
  const [songPlaying, setSongPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);

  const start = useCallback(() => setMusicOn(true), []);
  const togglePlaying = useCallback(() => setMusicOn((on) => !on), []);

  const changeVolume = useCallback((direction: 1 | -1) => {
    setVolume((current) => {
      const next = Math.round((current + direction * VOLUME_STEP) * 10) / 10;
      return Math.min(1, Math.max(0, next));
    });
  }, []);

  const value = useMemo(
    () => ({ musicOn, volume, start, togglePlaying, changeVolume, setSongPlaying }),
    [musicOn, volume, start, togglePlaying, changeVolume],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <BackgroundMusic active={musicOn && !songPlaying} volume={volume} />
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic debe usarse dentro de MusicProvider');
  return context;
}
