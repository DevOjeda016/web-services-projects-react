import type { CSSProperties } from 'react';
import { cn } from '../../lib/utils';
import { Reveal } from '../../shared/Reveal';

const STEPS = [
  {
    accent: 1,
    title: 'Descubrimiento',
    content: 'Entendemos tu operación, objetivos y restricciones antes de proponer una solución.',
  },
  {
    accent: 2,
    title: 'Diseño y prototipado',
    content: 'Diseñamos la solución y la validamos contigo antes de escribir código.',
  },
  {
    accent: 3,
    title: 'Desarrollo',
    content: 'Construimos e integramos la solución con entregas incrementales.',
  },
  {
    accent: 4,
    title: 'Lanzamiento y soporte',
    content: 'Publicamos, medimos resultados y damos seguimiento post-lanzamiento.',
  },
] as const;

export function Proceso() {
  return (
    <section
      id="proceso"
      className="relative isolate mx-auto max-w-6xl overflow-hidden px-6 py-24 sm:px-10 sm:py-32"
    >
      <div
        className="glow par-y -z-10 hidden size-96 opacity-[0.1] md:block"
        style={
          {
            top: '6rem',
            right: '-5rem',
            background: 'var(--accent-3)',
            '--par-from': '80px',
            '--par-to': '-80px',
          } as CSSProperties
        }
        aria-hidden="true"
      />

      <div className="max-w-2xl">
        <Reveal
          as="h2"
          className="text-foreground text-4xl font-extrabold tracking-[-0.02em]"
          style={{ textWrap: 'balance' }}
        >
          Cómo trabajamos
        </Reveal>
        <Reveal as="p" delay={60} className="text-muted-foreground mt-4 text-lg leading-relaxed">
          Un proceso claro, de principio a fin.
        </Reveal>
      </div>

      <ol className="proceso-list relative mt-16 max-w-2xl">
        <div className="proceso-rail" aria-hidden="true" />
        {STEPS.map((step, i) => (
          <Reveal
            as="li"
            key={step.title}
            kind="left"
            delay={i * 90}
            className={cn('relative pl-14', i < STEPS.length - 1 && 'pb-12')}
          >
            <span
              className="bg-background absolute top-0 left-0 flex size-10 items-center justify-center rounded-full border font-mono text-sm"
              style={{
                color: `var(--accent-${step.accent})`,
                borderColor: `color-mix(in srgb, var(--accent-${step.accent}) 45%, transparent)`,
              }}
            >
              {'0' + (i + 1)}
            </span>
            <h3 className="text-foreground pt-1.5 text-xl font-semibold">{step.title}</h3>
            <p className="text-muted-foreground mt-2 max-w-md leading-relaxed">{step.content}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
