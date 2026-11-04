import { useEffect, useState, type FormEvent } from 'react';
import { Gift, Heart, Pencil, RotateCcw } from 'lucide-react';
import Modal from '@/components/Modal';
import Section from '@/components/Section';
import { DEFAULT_SURPRISE } from '@/data/defaults';
import { usePersistentState } from '@/hooks/usePersistentState';
import type { SurpriseContent } from '@/types';

type Stage = 'closed' | 'shaking' | 'opening' | 'revealed';

const SHAKE_MS = 700;
const OPEN_MS = 900;

export default function SurpriseSection() {
  const [content, saveContent] = usePersistentState<SurpriseContent>('pu:surprise', DEFAULT_SURPRISE);
  const [stage, setStage] = useState<Stage>('closed');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (stage === 'shaking') {
      const id = window.setTimeout(() => setStage('opening'), SHAKE_MS);
      return () => window.clearTimeout(id);
    }
    if (stage === 'opening') {
      const id = window.setTimeout(() => setStage('revealed'), OPEN_MS);
      return () => window.clearTimeout(id);
    }
  }, [stage]);

  const isOpen = stage === 'opening' || stage === 'revealed';

  return (
    <Section
      id="sorpresa"
      eyebrow="Final"
      title="Una sorpresa para ti"
      description="Hay algo especial guardado para ti. Toca la caja cuando estés lista."
      icon={Gift}
    >
      <div className="flex flex-col items-center">
        <button
          onClick={() => stage === 'closed' && setStage('shaking')}
          disabled={stage !== 'closed'}
          aria-label="Abrir la caja de regalo"
          className="group relative mx-auto h-64 w-64 cursor-pointer disabled:cursor-default md:h-72 md:w-72"
        >
          <div className="absolute -inset-6 rounded-full bg-blush-300/40 blur-2xl transition duration-700 group-hover:bg-blush-300/60" />
          <div
            className={`absolute inset-x-0 bottom-0 top-[30%] rounded-b-2xl bg-gradient-to-br from-cherry-400 via-cherry-500 to-cherry-700 shadow-[0_30px_60px_-20px_rgba(154,18,52,0.6)] transition duration-500 ${
              stage === 'shaking' ? 'animate-gift-shake' : stage === 'closed' ? 'group-hover:-translate-y-1' : ''
            }`}
          >
            <span className="absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 bg-blush-200/90" />
          </div>
          <div
            className={`absolute inset-x-0 top-[20%] h-[16%] origin-bottom rounded-t-xl bg-gradient-to-br from-cherry-300 via-cherry-400 to-cherry-600 shadow-md transition-all duration-700 ease-out ${
              isOpen ? '-translate-y-16 -rotate-12 opacity-0' : 'group-hover:-translate-y-1'
            }`}
          >
            <span className="absolute inset-y-0 left-1/2 w-7 -translate-x-1/2 bg-blush-200/90" />
          </div>
          <div
            className={`absolute left-1/2 top-[14%] flex -translate-x-1/2 gap-1 transition-all duration-700 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <span className="h-8 w-8 -rotate-45 rounded-full border-[5px] border-blush-200 bg-cherry-400" />
            <span className="h-8 w-8 rotate-45 rounded-full border-[5px] border-blush-200 bg-cherry-400" />
          </div>
        </button>

        {stage === 'closed' && (
          <p className="mt-6 animate-fade-in text-sm text-dusty-700">Toca la caja para descubrir tu regalo</p>
        )}

        {stage === 'revealed' && (
          <article className="card relative mt-10 w-full max-w-2xl animate-slide-up p-8 text-center md:p-12">
            <Heart className="mx-auto h-7 w-7 fill-cherry-500 text-cherry-600" />
            <h3 className="mt-5 text-3xl font-semibold text-ink-900 md:text-4xl">{content.title}</h3>
            <p className="mt-6 whitespace-pre-line font-display text-xl leading-relaxed text-ink-800 md:text-2xl">
              {content.message}
            </p>
            <div className="mt-10 flex flex-col-reverse justify-center gap-3 sm:flex-row">
              <button onClick={() => setStage('closed')} className="btn-secondary">
                <RotateCcw className="h-4 w-4" />
                Cerrar la caja
              </button>
              <button onClick={() => setEditing(true)} className="btn-primary">
                <Pencil className="h-4 w-4" />
                Editar mensaje
              </button>
            </div>
          </article>
        )}
      </div>

      {editing && <SurpriseDialog content={content} onClose={() => setEditing(false)} onSave={saveContent} />}
    </Section>
  );
}

interface SurpriseDialogProps {
  content: SurpriseContent;
  onClose: () => void;
  onSave: (next: SurpriseContent) => boolean;
}

function SurpriseDialog({ content, onClose, onSave }: SurpriseDialogProps) {
  const [form, setForm] = useState(content);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const message = form.message.trim();
    if (!title || !message) {
      setError('El título y el mensaje no pueden quedar vacíos.');
      return;
    }
    if (onSave({ title, message })) onClose();
    else setError('No se pudo guardar el mensaje. Revisa el espacio disponible en tu navegador.');
  };

  return (
    <Modal open title="Editar la sorpresa" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="label">Título</span>
          <input
            className="input"
            maxLength={80}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="label">Mensaje</span>
          <textarea
            className="input min-h-[220px] resize-y leading-relaxed"
            maxLength={2000}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>
        {error && <p className="text-sm text-cherry-600">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Guardar mensaje
          </button>
        </div>
      </form>
    </Modal>
  );
}
