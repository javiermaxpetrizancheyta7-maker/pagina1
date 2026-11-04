import { useState } from 'react';
import { Mail } from 'lucide-react';
import Section from '@/components/Section';
import { DEFAULT_LETTERS } from '@/data/defaults';
import { usePersistentState } from '@/hooks/usePersistentState';
import LetterDialog from '@/sections/letters/LetterDialog';
import LetterEnvelope from '@/sections/letters/LetterEnvelope';
import type { Letter } from '@/types';

export default function LettersSection() {
  const [letters, saveLetters] = usePersistentState<Letter[]>('pu:letters', DEFAULT_LETTERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = letters.find((letter) => letter.id === editingId);

  const update = (letter: Letter): boolean =>
    saveLetters(letters.map((item) => (item.id === letter.id ? letter : item)));

  return (
    <Section
      id="cartas"
      eyebrow="Capítulo tres"
      title="Cartas de amor"
      description="Cinco sobres para cinco momentos. Ábrelos cuando lo necesites y edítalos cuando quieras."
      icon={Mail}
    >
      <div className="grid gap-8 md:grid-cols-2">
        {letters.map((letter) => (
          <LetterEnvelope key={letter.id} letter={letter} onEdit={() => setEditingId(letter.id)} />
        ))}
      </div>

      {editing && (
        <LetterDialog key={editing.id} letter={editing} onClose={() => setEditingId(null)} onSave={update} />
      )}
    </Section>
  );
}
