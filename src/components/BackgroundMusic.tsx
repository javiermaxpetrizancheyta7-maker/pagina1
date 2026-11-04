import { useEffect, useRef, useState } from 'react';

const TRACKS = ['/music.mp3', '/music1.mp3', '/music2.mp3', '/music3.mp3', '/music4.mp3'];

interface BackgroundMusicProps {
  active: boolean;
  volume: number;
}

export default function BackgroundMusic({ active, volume }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);

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
  }, [active, trackIndex]);

  const handleEnded = () => {
    setTrackIndex((current) => (current + 1) % TRACKS.length);
  };

  return <audio ref={audioRef} src={TRACKS[trackIndex]} preload="auto" onEnded={handleEnded} />;
}
