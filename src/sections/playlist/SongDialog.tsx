import { useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import PhotoInput from '@/components/PhotoInput';
import type { Song } from '@/types';

interface SongDialogProps {
  song: Song;
  isNew: boolean;
  onClose: () => void;
  onSave: (song: Song) => boolean;
  onDelete: () => boolean;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export default function SongDialog({ song, isNew, onClose, onSave, onDelete }: SongDialogProps) {
  const [form, setForm] = useState(song);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const audioUrl = form.audioUrl.trim();
    if (!title) {
      setError('Escribe el nombre de la canción.');
      return;
    }
    if (audioUrl && !isHttpUrl(audioUrl)) {
      setError('El enlace de audio debe comenzar con http:// o https://');
      return;
    }
    const saved = onSave({
      ...form,
      title,
      artist: form.artist.trim(),
      description: form.description.trim(),
      audioUrl,
    });
    if (saved) onClose();
    else setError('No se pudo guardar la canción. Revisa el espacio disponible en tu navegador.');
  };

  const handleDelete = () => {
    if (onDelete()) onClose();
    else setError('No se pudo eliminar la canción. Intenta de nuevo.');
  };

  return (
    <Modal open title={isNew ? 'Nueva canción' : 'Editar canción'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
          <PhotoInput
            label="Portada"
            value={form.cover}
            onChange={(cover) => setForm({ ...form, cover })}
            aspectClass="aspect-square"
          />
          <div className="space-y-5">
            <label className="block">
              <span className="label">Canción</span>
              <input
                className="input"
                maxLength={100}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="label">Artista</span>
              <input
                className="input"
                maxLength={100}
                value={form.artist}
                onChange={(e) => setForm({ ...form, artist: e.target.value })}
              />
            </label>
          </div>
        </div>
        <label className="block">
          <span className="label">Qué significa para nosotros</span>
          <textarea
            className="input min-h-[100px] resize-y leading-relaxed"
            maxLength={400}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="label">Enlace de YouTube o de audio</span>
          <input
            className="input"
            type="url"
            placeholder="https://www.youtube.com/watch?v=…"
            value={form.audioUrl}
            onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
          />
          <span className="mt-2 block text-xs text-ink-600">
            Pega el enlace del video de YouTube para escucharla aquí. También puedes usar un archivo de audio que tengas permiso de reproducir. Sin enlace, la canción aparece sin reproductor.
          </span>
        </label>

        {error && <p className="text-sm text-cherry-600">{error}</p>}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          {!isNew ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-600">¿Eliminar?</span>
                <button type="button" onClick={handleDelete} className="btn-secondary border-cherry-300 text-cherry-600">
                  Sí, eliminar
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="btn-secondary">
                  No
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-dusty-600 underline-offset-4 transition hover:text-cherry-600 hover:underline"
              >
                Eliminar canción
              </button>
            )
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 sm:flex-none">
              Cancelar
            </button>
            <button type="submit" className="btn-primary flex-1 sm:flex-none">
              Guardar
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
