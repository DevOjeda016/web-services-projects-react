import type { CSSProperties } from 'react';
import { ArrowUpRight, Braces, Monitor, Plug, Workflow } from 'lucide-react';
import { Reveal } from '../../shared/Reveal';

const SERVICES = [
  {
    icon: Monitor,
    accent: 2,
    title: 'Sitios web',
    description: 'Sitios diseñados y desarrollados a medida, rápidos y fáciles de mantener.',
  },
  {
    icon: Braces,
    accent: 1,
    title: 'Software a medida',
    description: 'Aplicaciones y herramientas internas construidas para tu operación.',
  },
  {
    icon: Workflow,
    accent: 3,
    title: 'Automatización de procesos',
    description: 'Flujos de trabajo automatizados que eliminan tareas repetitivas.',
  },
  {
    icon: Plug,
    accent: 4,
    title: 'Integraciones tecnológicas',
    description: 'Conectamos tus sistemas y datos para que trabajen juntos.',
  },
] as const;

export function Servicios() {
  return (
    <section
      id="servicios"
      className="relative isolate mx-auto max-w-6xl overflow-hidden px-6 py-24 sm:px-10 sm:py-32"
    >
      <div
        className="glow par-y -z-10 hidden size-96 opacity-[0.14] md:block"
        style={
          {
            top: '2rem',
            right: '-6rem',
            background: 'var(--accent-2)',
            '--par-from': '80px',
            '--par-to': '-80px',
          } as CSSProperties
        }
        aria-hidden="true"
      />

      <div className="grid gap-x-12 gap-y-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal
            as="h2"
            className="text-foreground text-4xl font-extrabold tracking-[-0.02em]"
            style={{ textWrap: 'balance' }}
          >
            Qué hacemos para tu organización
          </Reveal>
          <Reveal as="p" delay={60} className="text-muted-foreground mt-4 max-w-xs leading-relaxed">
            Cuatro frentes, un mismo criterio de ingeniería.
          </Reveal>
        </div>

        <ul className="border-border md:col-span-8 md:border-t">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal
                as="li"
                key={service.title}
                kind="left"
                delay={i * 70}
                className="group border-border border-t md:border-t-0 md:[&:not(:first-child)]:border-t"
              >
                <a
                  href="#contacto"
                  className="press hover:bg-muted/40 flex items-center gap-5 rounded-xl px-4 py-6 sm:gap-6"
                >
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-translate-y-0.5"
                    style={{
                      color: `var(--accent-${service.accent})`,
                      background: `color-mix(in srgb, var(--accent-${service.accent}) 12%, transparent)`,
                      borderColor: `color-mix(in srgb, var(--accent-${service.accent}) 34%, transparent)`,
                    }}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground block text-lg font-semibold">{service.title}</span>
                    <span className="text-muted-foreground mt-1 block text-sm leading-relaxed">
                      {service.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="text-muted-foreground shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
