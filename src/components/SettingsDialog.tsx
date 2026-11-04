import { useState, type FormEvent } from 'react';
import Modal from '@/components/Modal';
import type { CoupleSettings } from '@/types';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  settings: CoupleSettings;
  onSave: (next: CoupleSettings) => boolean;
}

export default function SettingsDialog({ open, onClose, settings, onSave }: SettingsDialogProps) {
  return (
    <Modal open={open} title="Ajustes de nuestra historia" onClose={onClose}>
      <SettingsForm initial={settings} onSave={onSave} onDone={onClose} />
    </Modal>
  );
}

interface SettingsFormProps {
  initial: CoupleSettings;
  onSave: (next: CoupleSettings) => boolean;
  onDone: () => void;
}

function SettingsForm({ initial, onSave, onDone }: SettingsFormProps) {
  const [form, setForm] = useState<CoupleSettings>(initial);
  const [error, setError] = useState('');

  const update = (field: keyof CoupleSettings) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const cleaned: CoupleSettings = {
      nameA: form.nameA.trim(),
      nameB: form.nameB.trim(),
      togetherSince: form.togetherSince,
      coverTitle: form.coverTitle.trim() || initial.coverTitle,
      coverPhrase: form.coverPhrase.trim(),
    };
    if (!onSave(cleaned)) {
      setError('No se pudieron guardar los cambios. Revisa el espacio disponible en tu navegador.');
      return;
    }
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">Tu nombre</span>
          <input className="input" value={form.nameA} onChange={(e) => update('nameA')(e.target.value)} maxLength={40} />
        </label>
        <label className="block">
          <span className="label">Su nombre</span>
          <input className="input" value={form.nameB} onChange={(e) => update('nameB')(e.target.value)} maxLength={40} />
        </label>
      </div>
      <label className="block">
        <span className="label">Fecha en que empezó nuestra historia</span>
        <input
          type="date"
          className="input"
          value={form.togetherSince}
          onChange={(e) => update('togetherSince')(e.target.value)}
        />
      </label>
      <label className="block">
        <span className="label">Título de la portada</span>
        <input className="input" value={form.coverTitle} onChange={(e) => update('coverTitle')(e.target.value)} maxLength={60} />
      </label>
      <label className="block">
        <span className="label">Frase romántica de la portada</span>
        <textarea
          className="input min-h-[96px] resize-y"
          value={form.coverPhrase}
          onChange={(e) => update('coverPhrase')(e.target.value)}
          maxLength={220}
        />
      </label>
      {error && <p className="text-sm text-cherry-600">{error}</p>}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onDone} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Guardar cambios
        </button>
      </div>
    </form>
  );
}
