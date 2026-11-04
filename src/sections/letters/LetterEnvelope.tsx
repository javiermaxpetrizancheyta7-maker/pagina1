import { useState } from 'react';
import { Heart, Pencil } from 'lucide-react';
import type { Letter } from '@/types';

interface LetterEnvelopeProps {
  letter: Letter;
  onEdit: () => void;
}

export default function LetterEnvelope({ letter, onEdit }: LetterEnvelopeProps) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`card flex flex-col p-6 transition-[grid-column] md:p-8 ${open ? 'md:col-span-2' : ''}`}>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="group flex w-full flex-col items-center text-center focus:outline-none"
      >
        <div className="relative mx-auto h-40 w-full max-w-[18rem] [perspective:900px]">
          <div
            className={`absolute inset-x-6 top-[22%] bottom-4 rounded-xl bg-cream-50 px-5 py-4 shadow-md transition-transform duration-1000 ease-out ${
              open ? '-translate-y-8' : 'translate-y-0'
            }`}
          >
            <span className="block h-1.5 w-3/4 rounded-full bg-blush-200" />
            <span className="mt-2 block h-1.5 w-1/2 rounded-full bg-blush-200" />
            <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-blush-200" />
          </div>
          <div className="absolute inset-x-0 bottom-0 top-[30%] rounded-b-2xl rounded-t-md bg-gradient-to-br from-blush-200 via-blush-300 to-dusty-300 shadow-[0_14px_28px_-12px_rgba(154,18,52,0.35)] transition duration-500 group-hover:brightness-105" />
          <div
            className={`absolute inset-x-0 top-0 h-[55%] origin-top bg-gradient-to-b from-blush-300 to-blush-200 transition-transform duration-700 ease-out [clip-path:polygon(0_0,100%_0,50%_100%)] ${
              open ? '[transform:rotateX(180deg)]' : ''
            }`}
          />
          <div
            className={`absolute left-1/2 top-[42%] flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-cherry-600 shadow-lg ring-4 ring-cream-50 transition-all duration-500 ${
              open ? 'scale-0 opacity-0' : 'animate-heartbeat group-hover:scale-110'
            }`}
          >
            <Heart className="h-5 w-5 fill-white text-white" />
          </div>
        </div>

        <h3 className="mt-6 text-2xl font-semibold leading-snug text-ink-900">{letter.label}</h3>
        <span className="mt-2 text-sm text-cherry-600 transition duration-300 group-hover:underline underline-offset-4">
          {open ? 'Cerrar la carta' : 'Toca el sobre para abrirlo'}
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-6 rounded-2xl border border-blush-200 bg-cream-100 p-6 md:p-8">
            <p className="whitespace-pre-line font-display text-xl leading-relaxed text-ink-800 md:text-2xl">
              {letter.text}
            </p>
            <div className="mt-6 flex justify-end">
              <button onClick={onEdit} className="btn-secondary">
                <Pencil className="h-4 w-4" />
                Editar carta
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
