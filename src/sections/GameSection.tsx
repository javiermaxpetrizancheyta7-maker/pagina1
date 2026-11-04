import { useState } from 'react';
import { Puzzle, RotateCcw, Settings2, Trophy } from 'lucide-react';
import Section from '@/components/Section';
import { DEFAULT_QUESTIONS } from '@/data/defaults';
import { usePersistentState } from '@/hooks/usePersistentState';
import QuestionsDialog from '@/sections/game/QuestionsDialog';
import type { QuizQuestion } from '@/types';

const LETTERS = ['A', 'B', 'C', 'D'];

type Phase = 'intro' | 'playing' | 'finished';

function finalMessage(score: number, total: number): string {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio === 1) return 'Me conoces por completo. Eres mi lugar seguro y sabes todo de mí.';
  if (ratio >= 0.6) return 'Nos conocemos muy bien, y cada día descubrimos algo nuevo el uno del otro.';
  return 'No pasa nada. Tenemos toda una vida por delante para conocernos todavía mejor.';
}

export default function GameSection() {
  const [questions, saveQuestions] = usePersistentState<QuizQuestion[]>('pu:questions', DEFAULT_QUESTIONS);
  const [phase, setPhase] = useState<Phase>('intro');
  const [round, setRound] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);

  const current = round[index];
  const answered = selected !== null;

  const start = () => {
    setRound(questions);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setPhase('playing');
  };

  const choose = (option: number) => {
    if (answered || !current) return;
    setSelected(option);
    if (option === current.answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (index + 1 >= round.length) {
      setPhase('finished');
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  };

  return (
    <Section
      id="juego"
      eyebrow="Capítulo cinco"
      title="¿Cuánto nos conocemos?"
      description="Preguntas sobre nuestros gustos, recuerdos y pequeñas manías. Elige la respuesta y descubre cuánto sabes del otro."
      icon={Puzzle}
    >
      <div className="mx-auto max-w-2xl">
        <div className="card relative overflow-hidden p-6 md:p-10">
          {phase === 'intro' && (
            <div className="flex flex-col items-center text-center animate-fade-in">
              <p className="font-display text-2xl italic text-dusty-700 md:text-3xl">
                {questions.length > 0
                  ? `${questions.length} preguntas esperan por ti. ¿Estás lista para demostrar cuánto me conoces?`
                  : 'Todavía no hay preguntas. Agrega algunas para empezar el juego.'}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={start} disabled={questions.length === 0} className="btn-primary px-8 py-4">
                  Empezar el juego
                </button>
                <button onClick={() => setEditing(true)} className="btn-secondary">
                  <Settings2 className="h-4 w-4" />
                  Personalizar preguntas
                </button>
              </div>
            </div>
          )}

          {phase === 'playing' && current && (
            <div key={index} className="animate-fade-in">
              <div className="mb-8 flex items-center justify-between gap-4">
                <div className="flex gap-1.5">
                  {round.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i < index ? 'w-4 bg-cherry-500' : i === index ? 'w-8 bg-cherry-600' : 'w-4 bg-blush-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-ink-600">
                  {index + 1} / {round.length}
                </span>
              </div>

              <h3 className="text-center text-3xl font-semibold leading-snug text-ink-900 md:text-4xl">
                {current.question}
              </h3>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {current.options.map((option, optionIndex) => {
                  const isCorrect = optionIndex === current.answer;
                  const isChosen = optionIndex === selected;
                  let style = 'border-dusty-200 bg-white text-ink-900 hover:-translate-y-0.5 hover:border-blush-400 hover:bg-blush-50 hover:shadow-md';
                  if (answered && isCorrect) style = 'border-emerald-500 bg-emerald-50 text-emerald-900';
                  else if (answered && isChosen) style = 'border-cherry-500 bg-blush-100 text-cherry-700';
                  else if (answered) style = 'border-dusty-200 bg-white/60 text-ink-600';

                  return (
                    <button
                      key={optionIndex}
                      onClick={() => choose(optionIndex)}
                      disabled={answered}
                      className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition duration-300 active:scale-[0.98] disabled:cursor-default ${style}`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blush-100 text-sm text-cherry-700">
                        {LETTERS[optionIndex]}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 min-h-[90px]">
                {answered && (
                  <div className="animate-fade-up rounded-2xl bg-cream-100 p-5 text-center">
                    <p className={`font-medium ${selected === current.answer ? 'text-emerald-700' : 'text-cherry-600'}`}>
                      {selected === current.answer
                        ? '¡Así es! Me conoces muy bien.'
                        : `Casi. La respuesta correcta era: ${current.options[current.answer]}.`}
                    </p>
                    <button onClick={next} className="btn-primary mt-4">
                      {index + 1 >= round.length ? 'Ver mi resultado' : 'Siguiente pregunta'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {phase === 'finished' && (
            <div className="flex flex-col items-center text-center animate-scale-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blush-100 ring-1 ring-blush-300">
                <Trophy className="h-7 w-7 text-cherry-600" />
              </div>
              <p className="eyebrow mt-6">Tu puntuación</p>
              <p className="mt-2 font-display text-6xl font-semibold text-ink-900">
                {score}
                <span className="text-3xl text-dusty-600"> / {round.length}</span>
              </p>
              <p className="mx-auto mt-6 max-w-md font-display text-2xl italic leading-relaxed text-dusty-700">
                {finalMessage(score, round.length)}
              </p>
              <button onClick={start} className="btn-primary mt-10">
                <RotateCcw className="h-4 w-4" />
                Jugar otra vez
              </button>
              <button onClick={() => setEditing(true)} className="mt-4 text-sm text-dusty-700 underline-offset-4 transition hover:text-cherry-600 hover:underline">
                Personalizar preguntas
              </button>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <QuestionsDialog
          questions={questions}
          onSave={saveQuestions}
          onClose={() => setEditing(false)}
        />
      )}
    </Section>
  );
}
