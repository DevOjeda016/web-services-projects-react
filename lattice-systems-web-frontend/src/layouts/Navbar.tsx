import { useEffect, useState } from 'react';
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react';
import { buttonVariants } from '../components/ui/button';
import { cn } from '../lib/utils';
import { useTheme } from '../shared/theme';
import { useOnline } from '../shared/useOnline';

const NAV_ITEMS = [
  { label: 'Servicios', fragment: 'servicios' },
  { label: 'Proyectos', fragment: 'proyectos' },
  { label: 'Nosotros', fragment: 'nosotros' },
  { label: 'Proceso', fragment: 'proceso' },
] as const;

export function Navbar() {
  const { isDark, toggle } = useTheme();
  const online = useOnline();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');

  const themeLabel = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  const ThemeIcon = isDark ? Sun : Moon;

  useEffect(() => {
    const sections = NAV_ITEMS.map((i) => document.getElementById(i.fragment)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    sections.forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  return (
    <>
      <header className="border-border bg-background/80 fixed inset-x-0 top-0 z-[50] border-b backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6 sm:px-10">
          <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="Inicio, Lattice Systems">
            <img src="/lattice-logo.png" alt="" width={600} height={600} className="h-7 w-auto dark:hidden" />
            <img
              src="/lattice-logo-dark.png"
              alt=""
              width={600}
              height={600}
              className="hidden h-7 w-auto dark:block"
            />
            <span className="text-foreground text-[17px] font-extrabold tracking-tight">
              Lattice Systems
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.fragment;
              return (
                <a
                  key={item.fragment}
                  href={'#' + item.fragment}
                  className={cn(
                    'font-mono text-[13px] tracking-tight transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className={cn('pb-1', isActive ? 'signal-underline-on' : 'signal-underline')}>
                    {item.label}
                  </span>
                </a>
              );
            })}

            <button
              type="button"
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'ml-1')}
              aria-label={themeLabel}
              onClick={toggle}
            >
              <ThemeIcon className="size-[18px]" />
            </button>

            <a className={buttonVariants({ size: 'sm' })} href="#contacto">
              Hablemos
              <ArrowRight />
            </a>
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              aria-label={themeLabel}
              onClick={toggle}
            >
              <ThemeIcon className="size-[18px]" />
            </button>
            <button
              type="button"
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Abrir menú"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="relative size-5">
                <Menu
                  className={cn(
                    'absolute inset-0 size-5 transition-all duration-150',
                    mobileOpen ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 size-5 transition-all duration-150',
                    mobileOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0',
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {!online && (
          <div className="bg-destructive/90 text-destructive-foreground py-1.5 text-center text-xs font-medium">
            Modo offline — lo que envíes en Contacto se guarda y se manda solo al volver la conexión.
          </div>
        )}

        {mobileOpen && (
          <div id="mobile-menu" className="border-border bg-background/95 border-t backdrop-blur-xl md:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-0.5 px-6 py-4" aria-label="Menú móvil">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.fragment}
                  href={'#' + item.fragment}
                  className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg px-3 py-2.5 font-mono text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                className={cn(buttonVariants({ size: 'sm' }), 'mt-3')}
                href="#contacto"
                onClick={() => setMobileOpen(false)}
              >
                Hablemos
                <ArrowRight />
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer: keeps content clear of the fixed nav */}
      <div className="h-18" aria-hidden="true" />
    </>
  );
}
