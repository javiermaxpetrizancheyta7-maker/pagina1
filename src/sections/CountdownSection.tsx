import { CalendarHeart, Hourglass, Settings2 } from 'lucide-react';
import Section from '@/components/Section';
import { useCoupleSettings } from '@/context/CoupleSettingsContext';
import { useNow } from '@/hooks/useInView';
import {
  elapsedParts,
  formatLongDate,
  isAnniversaryToday,
  nextAnniversary,
  parseLocalDate,
  remainingParts,
  yearsSince,
  type TimeParts,
} from '@/lib/dates';

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-white/90 px-3 py-5 text-center shadow-sm ring-1 ring-blush-200 md:px-5">
      <span className="block font-display text-4xl font-semibold tabular-nums text-ink-900 md:text-5xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-2 block text-[11px] uppercase tracking-[0.25em] text-ink-600">{label}</span>
    </div>
  );
}

function TimeGrid({ parts, showDays = true }: { parts: TimeParts; showDays?: boolean }) {
  return (
    <div className={`grid gap-3 md:gap-4 ${showDays ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3'}`}>
      {showDays && <TimeUnit value={parts.days} label="Días" />}
      <TimeUnit value={parts.hours} label="Horas" />
      <TimeUnit value={parts.minutes} label="Minutos" />
      <TimeUnit value={parts.seconds} label="Segundos" />
    </div>
  );
}

export default function CountdownSection() {
  const { settings, openSettings } = useCoupleSettings();
  const now = useNow(1000);

  return (
    <Section
      id="contador"
      eyebrow="Capítulo nueve"
      title="Cuenta regresiva"
      description="Cada segundo que compartimos y la cuenta atrás para nuestro próximo aniversario."
      icon={Hourglass}
    >
      {settings.togetherSince ? (
        <CountdownContent since={parseLocalDate(settings.togetherSince)} sinceText={settings.togetherSince} now={now} onEdit={openSettings} />
      ) : (
        <div className="card mx-auto max-w-xl p-10 text-center">
          <CalendarHeart className="mx-auto h-10 w-10 text-cherry-600" />
          <p className="mt-4 text-lg text-ink-700">Indica la fecha en que comenzó su historia para iniciar el contador.</p>
          <button onClick={openSettings} className="btn-primary mt-6">
            <Settings2 className="h-4 w-4" />
            Configurar la fecha
          </button>
        </div>
      )}
    </Section>
  );
}

interface CountdownContentProps {
  since: Date;
  sinceText: string;
  now: Date;
  onEdit: () => void;
}

function CountdownContent({ since, sinceText, now, onEdit }: CountdownContentProps) {
  const elapsed = elapsedParts(since, now);
  const years = yearsSince(since, now);
  const anniversary = nextAnniversary(since, now);
  const remaining = remainingParts(anniversary, now);
  const celebrating = isAnniversaryToday(since, now);
  const anniversaryYears = anniversary.getFullYear() - since.getFullYear();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="card p-8 md:p-12">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow">Juntos desde el {formatLongDate(sinceText)}</p>
          <p className="mt-4 font-display text-xl italic text-dusty-700">
            {years > 0 ? `${years} ${years === 1 ? 'año' : 'años'} de historia, y contando` : 'Cada día es un nuevo capítulo'}
          </p>
          <div className="mt-8 w-full">
            <TimeGrid parts={elapsed} />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button onClick={onEdit} className="btn-secondary">
            <Settings2 className="h-4 w-4" />
            Editar fecha
          </button>
        </div>
      </div>

      <div className="card relative overflow-hidden p-8 md:p-12">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blush-200/60 blur-3xl" />
        <div className="relative text-center">
          <p className="eyebrow">Próximo aniversario</p>
          <p className="mt-3 font-display text-3xl font-semibold text-ink-900">
            {anniversary.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="mt-2 text-ink-600">
            {celebrating
              ? '¡Hoy es nuestro aniversario! Feliz día, mi amor.'
              : `Cumpliremos ${anniversaryYears} ${anniversaryYears === 1 ? 'año' : 'años'} juntos.`}
          </p>
          <div className="mt-8">
            <TimeGrid parts={remaining} />
          </div>
        </div>
      </div>
    </div>
  );
}
