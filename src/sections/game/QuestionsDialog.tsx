import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Pencil, Plus, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';
import { createId } from '@/lib/id';
import type { QuizQuestion } from '@/types';

const OPTION_COUNT = 4;

interface QuestionsDialogProps {
  questions: QuizQuestion[];
  onSave: (next: QuizQuestion[]) => boolean;
  onClose: () => void;
}

function emptyQuestion(): QuizQuestion {
  return { id: createId(), question: '', options: Array(OPTION_COUNT).fill(''), answer: 0 };
}

export default function QuestionsDialog({ questions, onSave, onClose }: QuestionsDialogProps) {
  const [draft, setDraft] = useState<{ question: QuizQuestion; isNew: boolean } | null>(null);
  const [error, setError] = useState('');

  const save = (next: QuizQuestion[]) => {
    if (onSave(next)) {
      setError('');
      return true;
    }
    setError('No se pudieron guardar las preguntas. Revisa el espacio disponible en tu navegador.');
    return false;
  };

  const remove = (id: string) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    save(questions.filter((q) => q.id !== id));
  };

  return (
    <Modal open title={draft ? (draft.isNew ? 'Nueva pregunta' : 'Editar pregunta') : 'Personalizar preguntas'} onClose={onClose}>
      {draft ? (
        <QuestionForm
          initial={draft.question}
          onCancel={() => setDraft(null)}
          onSave={(question) => {
            const next = draft.isNew
              ? [...questions, question]
              : questions.map((q) => (q.id === question.id ? question : q));
            if (save(next)) setDraft(null);
          }}
        />
      ) : (
        <div className="space-y-5">
          {questions.length === 0 && (
            <p className="text-center text-ink-600">Aún no hay preguntas. Agrega la primera para empezar el juego.</p>
          )}
          <ul className="space-y-3">
            {questions.map((q, index) => (
              <li key={q.id} className="flex items-center gap-3 rounded-2xl border border-blush-200 bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-100 text-sm font-medium text-cherry-600">
                  {index + 1}
                </span>
                <p className="min-w-0 flex-1 truncate text-ink-900">{q.question}</p>
                <button onClick={() => setDraft({ question: q, isNew: false })} className="btn-icon" aria-label="Editar pregunta">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(q.id)} className="btn-icon hover:text-cherry-600" aria-label="Eliminar pregunta">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          {error && <p className="text-sm text-cherry-600">{error}</p>}
          <button onClick={() => setDraft({ question: emptyQuestion(), isNew: true })} className="btn-primary w-full">
            <Plus className="h-4 w-4" />
            Nueva pregunta
          </button>
        </div>
      )}
    </Modal>
  );
}

interface QuestionFormProps {
  initial: QuizQuestion;
  onSave: (question: QuizQuestion) => void;
  onCancel: () => void;
}

function QuestionForm({ initial, onSave, onCancel }: QuestionFormProps) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');

  const setOption = (index: number, value: string) =>
    setForm({ ...form, options: form.options.map((option, i) => (i === index ? value : option)) });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const question = form.question.trim();
    const options = form.options.map((option) => option.trim());
    if (!question || options.some((option) => !option)) {
      setError('Escribe la pregunta y las cuatro opciones.');
      return;
    }
    onSave({ ...form, question, options });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="label">Pregunta</span>
        <textarea
          className="input min-h-[90px] resize-y"
          maxLength={200}
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
        />
      </label>

      <fieldset className="space-y-3">
        <legend className="label">Opciones (marca la respuesta correcta)</legend>
        {form.options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, answer: index })}
              aria-pressed={form.answer === index}
              aria-label={`Marcar opción ${index + 1} como correcta`}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition duration-300 ${
                form.answer === index
                  ? 'border-cherry-600 bg-cherry-600 text-white'
                  : 'border-dusty-300 bg-white text-transparent hover:border-cherry-400'
              }`}
            >
              <Check className="h-4 w-4" />
            </button>
            <input
              className="input"
              maxLength={120}
              value={option}
              placeholder={`Opción ${index + 1}`}
              onChange={(e) => setOption(index, e.target.value)}
            />
          </div>
        ))}
      </fieldset>

      {error && <p className="text-sm text-cherry-600">{error}</p>}

      <div className="flex justify-between gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <button type="submit" className="btn-primary">
          Guardar pregunta
        </button>
      </div>
    </form>
  );
}
