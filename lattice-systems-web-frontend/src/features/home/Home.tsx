import { Hero } from './Hero';
import { Nosotros } from './Nosotros';
import { Servicios } from './Servicios';
import { Proyectos } from './Proyectos';
import { Proceso } from './Proceso';
import { Contacto } from './Contacto';

export function Home() {
  return (
    <main>
      <Hero />
      <Nosotros />
      <Servicios />
      <Proyectos />
      <Proceso />
      <Contacto />
    </main>
  );
}
