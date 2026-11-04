import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
}

export default function Section({ id, eyebrow, title, description, icon: Icon, children }: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section id={id} ref={ref} className="relative scroll-mt-20 px-5 py-20 md:px-10 md:py-28">
      <div
        className={`mx-auto max-w-6xl transition-all duration-1000 ease-out ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        <header className="mb-12 text-center">
          <p className="eyebrow">{eyebrow}</p>
          <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-blush-200">
            <Icon className="h-5 w-5 text-cherry-600" />
          </div>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-ink-900 md:text-5xl">{title}</h2>
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-600">{description}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}
