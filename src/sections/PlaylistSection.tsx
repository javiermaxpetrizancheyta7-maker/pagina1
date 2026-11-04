import { useEffect, useRef, useState } from 'react';
import { Music, Pause, Pencil, Play, Plus, SkipBack, SkipForward } from 'lucide-react';
import Section from '@/components/Section';
import { useMusic } from '@/context/MusicContext';
import { usePersistentState } from '@/hooks/usePersistentState';
import { DEFAULT_SONGS } from '@/data/defaults';
import { createId } from '@/lib/id';
import { getYouTubeId, youtubeEmbedUrl, youtubeThumbnailUrl } from '@/lib/youtube';
import SongDialog from '@/sections/playlist/SongDialog';
import type { Song } from '@/types';

interface DialogState {
  song: Song;
  isNew: boolean;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  return `${minutes}:${String(total % 60).padStart(2, '0')}`;
}

function isDirectAudio(song: Song | undefined): boolean {
  return Boolean(song?.audioUrl) && getYouTubeId(song?.audioUrl ?? '') === null;
}

function coverOf(song: Song): string {
  if (song.cover) return song.cover;
  const youtubeId = getYouTubeId(song.audioUrl);
  return youtubeId ? youtubeThumbnailUrl(youtubeId) : '';
}

function Cover({ src, className }: { src: string; className: string }) {
  if (src) return <img src={src} alt="" className={`${className} object-cover`} />;
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br from-blush-200 via-blush-300 to-dusty-300`}>
      <Music className="h-1/3 w-1/3 text-white/90" />
    </div>
  );
}

export default function PlaylistSection() {
  const [songs, saveSongs] = usePersistentState<Song[]>('pu:songs', DEFAULT_SONGS);
  const { setSongPlaying } = useMusic();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState({ current: 0, duration: 0 });
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const safeIndex = songs.length === 0 ? 0 : Math.min(index, songs.length - 1);
  const song = songs[safeIndex];
  const youtubeId = song ? getYouTubeId(song.audioUrl) : null;
  const hasAudio = isDirectAudio(song);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, song?.id, song?.audioUrl]);

  useEffect(() => {
    setSongPlaying(playing || youtubeId !== null);
    return () => setSongPlaying(false);
  }, [playing, youtubeId, setSongPlaying]);

  const choose = (next: number) => {
    if (next === safeIndex) {
      if (hasAudio) setPlaying((value) => !value);
      return;
    }
    setIndex(next);
    setProgress({ current: 0, duration: 0 });
    setPlaying(isDirectAudio(songs[next]));
  };

  const step = (direction: 1 | -1) => {
    if (songs.length === 0) return;
    choose((safeIndex + direction + songs.length) % songs.length);
  };

  const togglePlay = () => {
    if (hasAudio) setPlaying((value) => !value);
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setProgress((prev) => ({ ...prev, current: value }));
  };

  const upsert = (next: Song): boolean => {
    const exists = songs.some((s) => s.id === next.id);
    const updated = exists ? songs.map((s) => (s.id === next.id ? next : s)) : [...songs, next];
    return saveSongs(updated);
  };

  const removeSong = (id: string): boolean => {
    const position = songs.findIndex((s) => s.id === id);
    const updated = songs.filter((s) => s.id !== id);
    if (!saveSongs(updated)) return false;
    if (position === safeIndex) setPlaying(false);
    if (position >= 0 && position < safeIndex) setIndex(safeIndex - 1);
    return true;
  };

  const openNew = () =>
    setDialog({ song: { id: createId(), title: '', artist: '', description: '', cover: '', audioUrl: '' }, isNew: true });

  return (
    <Section
      id="playlist"
      eyebrow="Capítulo ocho"
      title="Nuestra playlist"
      description="Las canciones que nos pertenecen, con la historia detrás de cada una."
      icon={Music}
    >
      {song ? (
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="card flex flex-col items-center p-8 text-center md:p-10">
            {youtubeId ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ink-900 shadow-[0_24px_50px_-18px_rgba(154,18,52,0.45)] ring-4 ring-white">
                <iframe
                  key={youtubeId}
                  src={youtubeEmbedUrl(youtubeId)}
                  title={song.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative h-56 w-56 md:h-64 md:w-64">
                <div
                  className="h-full w-full animate-spin-slow overflow-hidden rounded-full shadow-[0_24px_50px_-18px_rgba(154,18,52,0.45)] ring-8 ring-white"
                  style={{ animationPlayState: playing ? 'running' : 'paused' }}
                >
                  <Cover src={coverOf(song)} className="h-full w-full" />
                </div>
                <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream-50 ring-2 ring-blush-200" />
              </div>
            )}

            <h3 className="mt-8 text-3xl font-semibold text-ink-900">{song.title}</h3>
            {song.artist && <p className="mt-1 text-sm uppercase tracking-[0.2em] text-cherry-600">{song.artist}</p>}
            {song.description && (
              <p className="mx-auto mt-4 max-w-sm font-display text-lg italic leading-relaxed text-dusty-700">
                {song.description}
              </p>
            )}

            {hasAudio && (
              <div className="mt-8 w-full">
                <input
                  type="range"
                  min={0}
                  max={progress.duration || 0}
                  step={0.1}
                  value={progress.current}
                  onChange={(e) => seek(Number(e.target.value))}
                  aria-label="Progreso de la canción"
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-blush-100 accent-cherry-600"
                />
                <div className="mt-2 flex justify-between text-xs text-ink-600">
                  <span>{formatTime(progress.current)}</span>
                  <span>{formatTime(progress.duration)}</span>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center gap-6">
              <button onClick={() => step(-1)} className="btn-icon h-12 w-12" aria-label="Canción anterior">
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={togglePlay}
                disabled={!hasAudio}
                aria-label={playing ? 'Pausar' : 'Reproducir'}
                className="btn-primary h-16 w-16 rounded-full p-0 disabled:opacity-40"
              >
                {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
              </button>
              <button onClick={() => step(1)} className="btn-icon h-12 w-12" aria-label="Canción siguiente">
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
            {youtubeId && (
              <p className="mt-6 text-sm text-dusty-700">Reproduce la canción desde el video de arriba.</p>
            )}
            {!hasAudio && !youtubeId && (
              <p className="mt-6 text-sm text-dusty-700">
                Agrega el enlace de la canción en Editar para escucharla aquí.
              </p>
            )}

            <audio
              ref={audioRef}
              src={hasAudio ? song.audioUrl : undefined}
              preload="metadata"
              onLoadedMetadata={(e) => setProgress((prev) => ({ ...prev, duration: e.currentTarget.duration }))}
              onTimeUpdate={(e) => setProgress((prev) => ({ ...prev, current: e.currentTarget.currentTime }))}
              onEnded={() => {
                if (songs.length <= 1) {
                  const audio = audioRef.current;
                  if (audio) {
                    audio.currentTime = 0;
                    void audio.play();
                  }
                  return;
                }
                step(1);
              }}
              onError={() => setPlaying(false)}
            />
          </div>

          <div className="card flex flex-col p-4 md:p-6">
            <ul className="flex-1 space-y-2">
              {songs.map((item, position) => {
                const current = position === safeIndex;
                return (
                  <li
                    key={item.id}
                    className={`group flex items-center gap-3 rounded-2xl p-3 transition duration-300 ${
                      current ? 'bg-blush-100 ring-1 ring-blush-300' : 'hover:bg-blush-50'
                    }`}
                  >
                    <button
                      onClick={() => choose(position)}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                    >
                      <Cover src={coverOf(item)} className="h-14 w-14 shrink-0 rounded-xl shadow-md" />
                      <span className="min-w-0">
                        <span className={`block truncate font-medium ${current ? 'text-cherry-700' : 'text-ink-900'}`}>
                          {item.title}
                        </span>
                        <span className="block truncate text-sm text-ink-600">{item.artist || 'Sin artista'}</span>
                      </span>
                      {current && playing && (
                        <span className="ml-auto flex h-4 items-end gap-0.5" aria-hidden="true">
                          {[0, 1, 2].map((bar) => (
                            <span
                              key={bar}
                              className="w-1 origin-bottom animate-pulse rounded-full bg-cherry-500"
                              style={{ height: `${10 + bar * 4}px`, animationDelay: `${bar * 150}ms` }}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setDialog({ song: item, isNew: false })}
                      className="btn-icon opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Editar canción"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <button onClick={openNew} className="btn-secondary mt-4 w-full">
              <Plus className="h-4 w-4" />
              Agregar una canción
            </button>
          </div>
        </div>
      ) : (
        <div className="card mx-auto max-w-xl p-10 text-center">
          <Music className="mx-auto h-10 w-10 text-cherry-600" />
          <p className="mt-4 text-lg text-ink-700">Todavía no hay canciones en nuestra playlist.</p>
          <button onClick={openNew} className="btn-primary mt-6">
            <Plus className="h-4 w-4" />
            Agregar la primera canción
          </button>
        </div>
      )}

      {dialog && (
        <SongDialog
          key={dialog.song.id}
          song={dialog.song}
          isNew={dialog.isNew}
          onClose={() => setDialog(null)}
          onSave={upsert}
          onDelete={() => removeSong(dialog.song.id)}
        />
      )}
    </Section>
  );
}
