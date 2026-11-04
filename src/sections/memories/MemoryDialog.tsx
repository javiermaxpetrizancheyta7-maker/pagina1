import { useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import PhotoInput from '@/components/PhotoInput';
import type { Memory } from '@/types';

interface MemoryDialogProps {
  memory: Memory;
  isNew: boolean;
  onClose: () => void;
  onSave: (memory: Memory) => boolean;
}

export default function MemoryDialog({ memory, isNew, onClose, onSave }: MemoryDialogProps) {
  const [form, setForm] = useState(memory);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.photo) {
      setError('Elige una fotografía para este recuerdo.');
      return;
    }
    const saved = onSave({ ...form, description: form.description.trim() });
    if (saved) onClose();
    else setError('No hay espacio suficiente para guardar esta foto. Elimina algún recuerdo e intenta de nuevo.');
  };

  return (
    <Modal open title={isNew ? 'Nuevo recuerdo' : 'Editar recuerdo'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <PhotoInput
          label="Fotografía"
          value={form.photo}
          onChange={(photo) => setForm({ ...form, photo })}
          aspectClass="aspect-[4/3]"
        />
        <label className="block">
          <span className="label">Fecha del recuerdo</span>
          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="label">Descripción</span>
          <textarea
            className="input min-h-[110px] resize-y leading-relaxed"
            maxLength={400}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="¿Qué estaba pasando en este momento?"
          />
        </label>
        {error && <p className="text-sm text-cherry-600">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Guardar recuerdo
          </button>
        </div>
      </form>
    </Modal>
  );
}
