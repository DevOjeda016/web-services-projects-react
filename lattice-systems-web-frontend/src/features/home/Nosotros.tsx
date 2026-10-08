import type { CSSProperties } from 'react';
import { Reveal } from '../../shared/Reveal';

const PILLARS = [
  {
    accent: 1,
    title: 'Soluciones a medida',
    description: 'Diseñadas para tu operación, no plantillas genéricas.',
  },
  {
    accent: 2,
    title: 'Entrega ágil',
    description: 'Avances incrementales y visibles, sin sorpresas al final.',
  },
  {
    accent: 4,
    title: 'Código confiable',
    description: 'Arquitecturas limpias, construidas para durar y escalar.',
  },
] as const;

export function Nosotros() {
  return (
    <section id="nosotros" className="border-border bg-muted relative isolate overflow-hidden border-t">
      <div
        className="glow par-y -z-10 hidden size-[30rem] opacity-[0.1] md:block"
        style={
          {
            top: '-4rem',
            right: '-8rem',
            background: 'var(--accent-1)',
            '--par-from': '90px',
            '--par-to': '-90px',
          } as CSSProperties
        }
        aria-hidden="true"
      />
      <div
        className="glow par-y -z-10 hidden size-96 opacity-[0.08] md:block"
        style={
          {
            bottom: '-6rem',
            left: '-6rem',
            background: 'var(--accent-2)',
            '--par-from': '-70px',
            '--par-to': '70px',
          } as CSSProperties
        }
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <Reveal
          as="h2"
          kind="blur"
          className="text-foreground max-w-4xl text-3xl leading-[1.25] font-semibold tracking-[-0.01em] sm:text-[2.6rem] sm:leading-[1.2]"
          style={{ textWrap: 'balance' }}
        >
          Somos un equipo enfocado en la <span className="text-signal">transformación digital</span> de
          organizaciones: sistemas internos, procesos automatizados y productos propios impulsados por
          IA.
        </Reveal>

        <Reveal
          as="p"
          delay={80}
          className="text-muted-foreground mt-8 max-w-2xl text-lg leading-relaxed"
        >
          SpaceAI, nuestra plataforma de gestión inteligente de espacios, nace de ese mismo criterio.
          Integramos metodologías ágiles y arquitecturas escalables en cada proyecto que entregamos.
        </Reveal>

        <div className="border-border mt-16 grid gap-px border-t sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} kind="scale" delay={i * 80} className="pt-8 sm:pr-8">
              <span className="font-mono text-sm" style={{ color: `var(--accent-${pillar.accent})` }}>
                {'0' + (i + 1)}
              </span>
              <h3 className="text-foreground mt-4 text-lg font-semibold">{pillar.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{pillar.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
