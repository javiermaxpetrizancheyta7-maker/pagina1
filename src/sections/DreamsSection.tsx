import { useState, type FormEvent } from 'react';
import { Check, Film, Globe, Heart, Plus, Sparkles, Sunset, Trash2, UtensilsCrossed, Cake } from 'lucide-react';
import Modal from '@/components/Modal';
import Section from '@/components/Section';
import { DEFAULT_DREAMS } from '@/data/defaults';
import { usePersistentState } from '@/hooks/usePersistentState';
import { createId } from '@/lib/id';
import { DREAM_CATEGORIES, type Dream, type DreamCategory } from '@/types';

const CATEGORY_ICONS: Record<DreamCategory, typeof Globe> = {
  Viajes: Globe,
  Películas: Film,
  Cocina: UtensilsCrossed,
  Aniversarios: Cake,
  Atardecer: Sunset,
  Sueños: Sparkles,
};

type Filter = 'Todas' | DreamCategory;

export default function DreamsSection() {
  const [dreams, saveDreams] = usePersistentState<Dream[]>('pu:dreams', DEFAULT_DREAMS);
  const [filter, setFilter] = useState<Filter>('Todas');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const visible = filter === 'Todas' ? dreams : dreams.filter((dream) => dream.category === filter);
  const doneCount = dreams.filter((dream) => dream.done).length;
  const percent = dreams.length === 0 ? 0 : Math.round((doneCount / dreams.length) * 100);

  const toggle = (id: string) => {
    const next = dreams.map((dream) => (dream.id === id ? { ...dream, done: !dream.done } : dream));
    if (!saveDreams(next)) setError('No se pudo actualizar la actividad. Intenta de nuevo.');
  };

  const remove = (id: string) => {
    if (!saveDreams(dreams.filter((dream) => dream.id !== id))) {
      setError('No se pudo eliminar la actividad. Intenta de nuevo.');
    }
  };

  const add = (dream: Dream): boolean => {
    if (!saveDreams([...dreams, dream])) return false;
    setFilter('Todas');
    return true;
  };

  return (
    <Section
      id="sueños"
      eyebrow="Capítulo seis"
      title="Nuestra lista de sueños"
      description="Todo lo que queremos vivir juntos. Marca cada sueño cuando se convierta en un recuerdo."
      icon={Globe}
    >
      <div className="card mx-auto max-w-4xl p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-baseline justify-between text-sm text-ink-600">
              <span>Sueños cumplidos</span>
              <span className="font-medium text-ink-800">
                {doneCount} de {dreams.length} ({percent}%)
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-blush-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blush-400 to-cherry-500 transition-all duration-700 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <button onClick={() => setAdding(true)} className="btn-primary self-start md:self-auto">
            <Plus className="h-4 w-4" />
            Agregar un sueño
          </button>
        </div>

        <div className="-mx-1 mt-8 flex gap-2 overflow-x-auto px-1 pb-2">
          {(['Todas', ...DREAM_CATEGORIES] as Filter[]).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition duration-300 ${
                filter === option
                  ? 'bg-cherry-600 text-white shadow-md'
                  : 'bg-blush-50 text-ink-700 ring-1 ring-blush-200 hover:-translate-y-0.5 hover:bg-blush-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-cherry-600">{error}</p>}

        {visible.length > 0 ? (
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {visible.map((dream) => {
              const Icon = CATEGORY_ICONS[dream.category];
              return (
                <li
                  key={dream.id}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 transition duration-300 hover:shadow-md ${
                    dream.done ? 'border-blush-300 bg-blush-50' : 'border-dusty-200 bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggle(dream.id)}
                    aria-pressed={dream.done}
                    aria-label={dream.done ? 'Marcar como pendiente' : 'Marcar como cumplido'}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition duration-300 active:scale-90 ${
                      dream.done
                        ? 'border-cherry-600 bg-cherry-600 text-white'
                        : 'border-dusty-300 text-transparent hover:border-cherry-400'
                    }`}
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-medium transition duration-300 ${
                        dream.done ? 'text-ink-600 line-through decoration-cherry-400' : 'text-ink-900'
                      }`}
                    >
                      {dream.title}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-dusty-700">
                      <Icon className="h-3.5 w-3.5" />
                      {dream.category}
                    </span>
                  </div>
                  <button
                    onClick={() => remove(dream.id)}
                    aria-label="Eliminar actividad"
                    className="btn-icon opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-10 text-center text-ink-600">No hay sueños en esta categoría todavía.</p>
        )}
      </div>

      {adding && <DreamDialog onClose={() => setAdding(false)} onSave={add} />}
    </Section>
  );
}

interface DreamDialogProps {
  onClose: () => void;
  onSave: (dream: Dream) => boolean;
}

function DreamDialog({ onClose, onSave }: DreamDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DreamCategory>('Viajes');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Escribe el sueño que quieren cumplir.');
      return;
    }
    if (onSave({ id: createId(), title: trimmed, category, done: false })) onClose();
    else setError('No se pudo guardar el sueño. Intenta de nuevo.');
  };

  return (
    <Modal open title="Nuevo sueño" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="label">¿Qué quieren vivir juntos?</span>
          <input
            className="input"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Ver las auroras boreales"
          />
        </label>
        <div>
          <span className="label">Categoría</span>
          <div className="flex flex-wrap gap-2">
            {DREAM_CATEGORIES.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                aria-pressed={category === option}
                className={`rounded-full px-4 py-2 text-sm transition duration-300 ${
                  category === option
                    ? 'bg-cherry-600 text-white shadow-md'
                    : 'bg-white text-ink-700 ring-1 ring-dusty-200 hover:bg-blush-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-cherry-600">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            <Heart className="h-4 w-4" />
            Guardar sueño
          </button>
        </div>
      </form>
    </Modal>
  );
}
