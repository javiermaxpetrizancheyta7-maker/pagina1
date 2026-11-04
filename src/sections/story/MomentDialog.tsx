import { useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import type { StoryMoment } from '@/types';

interface MomentDialogProps {
  moment: StoryMoment;
  isNew: boolean;
  onClose: () => void;
  onSave: (moment: StoryMoment) => boolean;
  onDelete: () => boolean;
}

export default function MomentDialog({ moment, isNew, onClose, onSave, onDelete }: MomentDialogProps) {
  const [form, setForm] = useState(moment);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError('Escribe un título para este momento.');
      return;
    }
    const saved = onSave({ ...form, title, date: form.date.trim(), text: form.text.trim() });
    if (saved) onClose();
    else setError('No se pudieron guardar los cambios. Revisa el espacio disponible en tu navegador.');
  };

  const handleDelete = () => {
    if (onDelete()) onClose();
    else setError('No se pudo eliminar el momento. Intenta de nuevo.');
  };

  return (
    <Modal open title={isNew ? 'Nuevo momento' : 'Editar momento'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="label">Título</span>
          <input
            className="input"
            maxLength={80}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ej. Nuestra primera cita"
          />
        </label>
        <label className="block">
          <span className="label">Fecha o época</span>
          <input
            className="input"
            maxLength={60}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            placeholder="Ej. Marzo de 2019"
          />
        </label>
        <label className="block">
          <span className="label">Cuéntalo con tus palabras</span>
          <textarea
            className="input min-h-[140px] resize-y leading-relaxed"
            maxLength={800}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
        </label>

        {error && <p className="text-sm text-cherry-600">{error}</p>}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          {!isNew ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-600">¿Eliminar este momento?</span>
                <button type="button" onClick={handleDelete} className="btn-secondary border-cherry-300 text-cherry-600">
                  Sí, eliminar
                </button>
                <button type="button" onClick={() => setConfirmDelete(false)} className="btn-secondary">
                  No
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className="text-sm text-dusty-600 underline-offset-4 transition hover:text-cherry-600 hover:underline">
                Eliminar momento
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
