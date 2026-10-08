import { Linkedin, Mail } from 'lucide-react';

const FOOTER_NAV = [
  { label: 'Servicios', fragment: 'servicios' },
  { label: 'Proyectos', fragment: 'proyectos' },
  { label: 'Nosotros', fragment: 'nosotros' },
  { label: 'Proceso', fragment: 'proceso' },
] as const;

const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-border bg-muted border-t">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <a href="#top" className="flex items-center gap-2.5">
              <img src="/lattice-logo-dark.png" alt="" width={600} height={600} className="h-6 w-auto" />
              <span className="text-foreground text-base font-extrabold tracking-tight">
                Lattice Systems
              </span>
            </a>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Diseñamos, construimos e integramos software a la medida de tu operación.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <nav className="flex flex-col gap-2.5" aria-label="Navegación del pie">
              {FOOTER_NAV.map((item) => (
                <a
                  key={item.fragment}
                  href={'#' + item.fragment}
                  className="text-muted-foreground hover:text-foreground w-fit text-sm transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2.5">
              <a
                href="mailto:hola@latticesystems.dev"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
              >
                <Mail size={16} />
                hola@latticesystems.dev
              </a>
              <a
                href="https://www.linkedin.com/company/lattice-systems"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-border mt-14 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground font-mono text-xs">© {YEAR} Lattice Systems</p>
          <p className="text-muted-foreground text-xs">Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
