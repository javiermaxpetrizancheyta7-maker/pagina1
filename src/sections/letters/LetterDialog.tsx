import { useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import type { Letter } from '@/types';

interface LetterDialogProps {
  letter: Letter;
  onClose: () => void;
  onSave: (letter: Letter) => boolean;
}

export default function LetterDialog({ letter, onClose, onSave }: LetterDialogProps) {
  const [form, setForm] = useState(letter);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const label = form.label.trim();
    const text = form.text.trim();
    if (!label || !text) {
      setError('El nombre del sobre y el mensaje no pueden quedar vacíos.');
      return;
    }
    if (onSave({ ...form, label, text })) onClose();
    else setError('No se pudieron guardar los cambios. Revisa el espacio disponible en tu navegador.');
  };

  return (
    <Modal open title="Editar carta" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="label">Cuándo abrirla</span>
          <input
            className="input"
            maxLength={100}
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="label">Mensaje</span>
          <textarea
            className="input min-h-[200px] resize-y leading-relaxed"
            maxLength={2000}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
        </label>
        {error && <p className="text-sm text-cherry-600">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Guardar carta
          </button>
        </div>
      </form>
    </Modal>
  );
}
