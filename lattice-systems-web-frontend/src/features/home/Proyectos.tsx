import { useEffect, useState, type CSSProperties } from 'react';
import {
  Armchair,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Waypoints,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { LatticeCanvas } from '../../shared/LatticeCanvas';
import { Reveal } from '../../shared/Reveal';
import { obtenerProyectos, type CaseStudy, type ProyectoDestacado } from '../../shared/proyectos';

// La API devuelve el nombre del icono; aquí se resuelve al componente de lucide.
const ICONOS: Record<string, LucideIcon> = {
  lucideShieldCheck: ShieldCheck,
  lucideArmchair: Armchair,
  lucideWaypoints: Waypoints,
  lucideSparkles: Sparkles,
};

// Contenido de respaldo: se muestra mientras carga la API o si falla, para que la seccion nunca aparezca vacia.
const DESTACADO_RESPALDO: ProyectoDestacado = {
  titulo: 'SpaceAI',
  etiqueta: 'Producto propio',
  descripcion:
    'Nuestra plataforma propia de inteligencia artificial, automatización y gestión inteligente de espacios.',
  url: 'https://spaceai.latticesystems.dev',
};

const CASOS_RESPALDO: CaseStudy[] = [
  {
    icon: 'lucideShieldCheck',
    accent: 1,
    title: 'Sistema de gestión de credenciales',
    problem: 'La validación de credenciales era manual y propensa a errores.',
    solution: 'Un sistema interno para emitir, validar y controlar credenciales en un solo lugar.',
    result: 'Validación centralizada y trazable, sin hojas de cálculo ni procesos manuales.',
    wide: true,
  },
  {
    icon: 'lucideArmchair',
    accent: 3,
    title: 'Mini ERP para mueblería',
    problem: 'Productos, clientes, ventas e inventario vivían separados, sin visibilidad conjunta.',
    solution: 'Un ERP a medida que centraliza productos, clientes, ventas e inventario.',
    result: 'Una sola plataforma para operar el negocio día a día.',
    wide: false,
  },
  {
    icon: 'lucideWaypoints',
    accent: 2,
    title: 'Captación de leads con n8n',
    problem: 'Los prospectos llegaban por distintos canales sin seguimiento claro.',
    solution: 'Automatizaciones con n8n para atraer, organizar y procesar leads en continuo.',
    result: 'Un flujo que capta y da seguimiento a prospectos sin intervención manual.',
    wide: false,
  },
];

export function Proyectos() {
  const [destacado, setDestacado] = useState<ProyectoDestacado>(DESTACADO_RESPALDO);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(CASOS_RESPALDO);

  useEffect(() => {
    let cancelado = false;
    obtenerProyectos()
      .then((data) => {
        if (cancelado) return;
        setDestacado(data.destacado);
        setCaseStudies(data.casosDeEstudio);
      })
      .catch(() => {
        // Si la API falla nos quedamos con el contenido de respaldo ya mostrado.
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <section
      id="proyectos"
      className="relative isolate mx-auto max-w-6xl overflow-hidden px-6 py-24 sm:px-10 sm:py-32"
    >
      <div
        className="glow par-y -z-10 hidden size-[28rem] opacity-[0.12] md:block"
        style={
          {
            top: '8rem',
            left: '-8rem',
            background: 'var(--accent-1)',
            '--par-from': '120px',
            '--par-to': '-120px',
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
          Sistemas que hemos construido
        </Reveal>
      </div>

      {/* Featured: SpaceAI, drenched navy island with its own live lattice */}
      <Reveal
        kind="scale"
        className="dark border-border bg-card relative mt-12 overflow-hidden rounded-3xl border"
      >
        <div className="absolute inset-0 opacity-70" aria-hidden="true">
          <LatticeCanvas density={0.8} interactive={false} />
        </div>
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(105deg, rgba(13,26,36,0.94) 30%, rgba(13,26,36,0.35) 100%)',
          }}
        />
        <div className="relative grid gap-8 p-8 sm:p-12 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div className="max-w-lg">
            <span className="text-signal border-signal/30 bg-signal-soft inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] tracking-[0.2em] uppercase">
              <Sparkles size={13} />
              {destacado.etiqueta}
            </span>
            <h3 className="text-foreground mt-5 text-3xl font-extrabold tracking-tight">
              {destacado.titulo}
            </h3>
            <p className="text-subtle-foreground mt-4 text-base leading-relaxed">
              {destacado.descripcion}
            </p>
            <a
              href={destacado.url}
              target="_blank"
              rel="noopener"
              className="text-foreground signal-underline press mt-6 inline-flex w-fit items-center gap-1.5 pb-1 text-sm font-medium"
            >
              Ver {destacado.titulo}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </Reveal>

      {/* Case studies: asymmetric grid, first spans full width */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {caseStudies.map((project, i) => {
          const Icon = ICONOS[project.icon];
          return (
            <Reveal
              as="article"
              key={project.title}
              kind={project.wide ? '' : 'scale'}
              delay={i * 80}
              className={cn(
                'card-accent border-border bg-card flex flex-col rounded-3xl border p-8',
                project.wide && 'md:col-span-2 md:flex-row md:items-start md:gap-12',
              )}
              style={{ '--ca': `var(--accent-${project.accent})` } as CSSProperties}
            >
              <div className={cn(project.wide && 'md:w-72 md:shrink-0')}>
                <span
                  className="flex size-11 items-center justify-center rounded-xl border"
                  style={{
                    color: `var(--accent-${project.accent})`,
                    background: `color-mix(in srgb, var(--accent-${project.accent}) 12%, transparent)`,
                    borderColor: `color-mix(in srgb, var(--accent-${project.accent}) 34%, transparent)`,
                  }}
                >
                  {Icon && <Icon size={20} />}
                </span>
                <h3 className="text-foreground mt-5 text-xl font-semibold">{project.title}</h3>
              </div>

              <dl className="mt-5 flex flex-1 flex-col gap-4 md:mt-0">
                <div>
                  <dt className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
                    Problema
                  </dt>
                  <dd className="text-subtle-foreground mt-1 text-sm leading-relaxed">{project.problem}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
                    Solución
                  </dt>
                  <dd className="text-subtle-foreground mt-1 text-sm leading-relaxed">{project.solution}</dd>
                </div>
                <div className="border-border border-t pt-4">
                  <dt
                    className="font-mono text-[11px] tracking-[0.18em] uppercase"
                    style={{ color: `var(--accent-${project.accent})` }}
                  >
                    Resultado
                  </dt>
                  <dd className="text-foreground mt-1 text-sm leading-relaxed">{project.result}</dd>
                </div>
              </dl>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
