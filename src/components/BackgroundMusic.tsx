import { useEffect, useRef } from 'react';

interface BackgroundMusicProps {
  active: boolean;
  volume: number;
}

export default function BackgroundMusic({ active, volume }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (active) {
      audio.play().catch((error) => {
        console.warn('No se pudo iniciar la música:', error);
      });
    } else {
      audio.pause();
    }
  }, [active]);

  return <audio ref={audioRef} src="/music.mp3" loop preload="auto" />;
}
