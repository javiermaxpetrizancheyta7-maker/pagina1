import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import BackgroundMusic from '@/components/BackgroundMusic';

interface MusicContextValue {
  musicOn: boolean;
  toggleMusic: () => void;
  setSongPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicOn, setMusicOn] = useState(false);
  const [songPlaying, setSongPlaying] = useState(false);

  const toggleMusic = useCallback(() => setMusicOn((on) => !on), []);

  const value = useMemo(
    () => ({ musicOn, toggleMusic, setSongPlaying }),
    [musicOn, toggleMusic],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <BackgroundMusic active={musicOn && !songPlaying} />
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic debe usarse dentro de MusicProvider');
  return context;
}
