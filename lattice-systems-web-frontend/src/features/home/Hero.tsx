import { useEffect, useRef } from 'react';
import { buttonVariants } from '../../components/ui/button';
import { LatticeCanvas } from '../../shared/LatticeCanvas';
import { Reveal } from '../../shared/Reveal';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Pointer parallax: se escribe directo en CSS vars (--mx/--my), sin re-renders.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const my = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      el.style.setProperty('--mx', mx.toFixed(3));
      el.style.setProperty('--my', my.toFixed(3));
    };
    const onLeave = () => {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-[calc(100dvh-4.5rem)] items-center overflow-hidden"
    >
      {/* The live lattice, on parallax layers (scroll drift + pointer) */}
      <div className="parallax-scroll absolute inset-0 z-0" aria-hidden="true">
        <div className="parallax-pointer h-full w-full">
          <LatticeCanvas density={1.05} />
        </div>
      </div>
      <div className="theme-scrim absolute inset-0 z-0" aria-hidden="true" />

      <div className="parallax-content relative z-[1] mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <div className="max-w-3xl">
          <Reveal
            as="p"
            className="text-signal font-mono text-xs tracking-[0.28em] uppercase"
          >
            Estudio de software
          </Reveal>

          <Reveal
            as="h1"
            delay={80}
            className="text-foreground mt-6 text-[clamp(2.5rem,6.2vw,4.75rem)] leading-[1] font-extrabold tracking-[-0.03em]"
            style={{ textWrap: 'balance' }}
          >
            Software a la medida de tu <span className="signal-underline-on pb-1">operación</span>
          </Reveal>

          <Reveal
            as="p"
            delay={160}
            className="text-subtle-foreground mt-7 max-w-xl text-lg leading-relaxed"
          >
            Diseñamos, construimos e integramos los sistemas que tu negocio necesita para operar
            mejor.
          </Reveal>

          <Reveal className="mt-10 flex flex-wrap items-center gap-3" delay={240}>
            <a className={buttonVariants({ size: 'lg' })} href="#contacto">
              Hablemos
            </a>
            <a className={buttonVariants({ size: 'lg', variant: 'outline' })} href="#proyectos">
              Ver proyectos
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
