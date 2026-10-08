export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface StoredContactMessage extends ContactMessage {
  id: string;
  recibidoEn: string;
}

interface ColaItem extends ContactMessage {
  clienteId: string;
}

const QUEUE_KEY = 'lattice-contacto-cola';

/** Respuesta HTTP no exitosa (4xx/5xx). Un fallo de red lanza TypeError desde fetch. */
export class HttpError extends Error {
  constructor(readonly status: number) {
    super(`HTTP ${status}`);
  }
}

export async function enviarMensaje(payload: ContactMessage): Promise<StoredContactMessage> {
  const res = await fetch('/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new HttpError(res.status);
  return res.json();
}

/** Sin respuesta del servidor (sin conexión, servidor caído): el mensaje se puede encolar. */
export function esErrorDeRed(err: unknown): boolean {
  return err instanceof TypeError;
}

function generarId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function leerCola(): ColaItem[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}

function guardarCola(cola: ColaItem[]): void {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(cola));
  } catch {
    // localStorage no disponible o navegador restringido
  }
}

export function encolarMensaje(payload: ContactMessage): void {
  const cola = leerCola();
  cola.push({ ...payload, clienteId: generarId() });
  guardarCola(cola);
}

let sincronizando = false;

/** Reintenta enviar la cola pendiente; se detiene en el primer fallo (seguimos sin red). */
export async function sincronizarCola(): Promise<void> {
  if (sincronizando) return;
  sincronizando = true;
  try {
    for (let cola = leerCola(); cola.length > 0; cola = leerCola()) {
      const [primero, ...resto] = cola;
      try {
        await enviarMensaje(primero);
      } catch {
        // seguimos sin conexion o el servidor no responde; reintentamos con el proximo evento 'online'
        return;
      }
      guardarCola(resto);
    }
  } finally {
    sincronizando = false;
  }
}

/** Arranca la sincronización: al cargar (si hay red) y cada vez que vuelve la conexión. */
export function iniciarSincronizacionContacto(): void {
  window.addEventListener('online', () => void sincronizarCola());
  if (navigator.onLine) void sincronizarCola();
}
