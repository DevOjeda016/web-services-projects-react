export interface CaseStudy {
  icon: string;
  accent: number;
  title: string;
  problem: string;
  solution: string;
  result: string;
  wide: boolean;
}

export interface ProyectoDestacado {
  titulo: string;
  etiqueta: string;
  descripcion: string;
  url: string;
}

export interface ProyectosData {
  destacado: ProyectoDestacado;
  casosDeEstudio: CaseStudy[];
}

export async function obtenerProyectos(): Promise<ProyectosData> {
  const res = await fetch('/api/proyectos');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
