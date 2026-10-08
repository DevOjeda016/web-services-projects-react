import { useState, type FormEvent } from 'react';
import { Check, Linkedin, LoaderCircle, Mail } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { LatticeCanvas } from '../../shared/LatticeCanvas';
import { Reveal } from '../../shared/Reveal';
import {
  encolarMensaje,
  enviarMensaje,
  esErrorDeRed,
  type ContactMessage,
  type StoredContactMessage,
} from '../../shared/contactMessages';

// Misma validación de correo que Validators.email de Angular.
const EMAIL_REGEXP =
  /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type Campo = 'name' | 'email';

const FORMATO_FECHA = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' });

export function Contacto() {
  const [values, setValues] = useState<ContactMessage>({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState<Record<Campo, boolean>>({ name: false, email: false });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [queued, setQueued] = useState(false);
  const [ultimoEnviado, setUltimoEnviado] = useState<StoredContactMessage | null>(null);
  const [queuedMensaje, setQueuedMensaje] = useState<ContactMessage | null>(null);

  const errors: Record<Campo, boolean> = {
    name: values.name === '',
    email: values.email === '' || !EMAIL_REGEXP.test(values.email),
  };
  const invalid = (campo: Campo): boolean => errors[campo] && touched[campo];

  const onChange = (campo: keyof ContactMessage, valor: string) =>
    setValues((v) => ({ ...v, [campo]: valor }));
  const onBlur = (campo: Campo) => setTouched((t) => ({ ...t, [campo]: true }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (errors.name || errors.email) {
      setTouched({ name: true, email: true });
      return;
    }
    setSubmitting(true);
    setError(false);
    const payload = { ...values };
    try {
      const mensaje = await enviarMensaje(payload);
      setUltimoEnviado(mensaje);
      setSent(true);
    } catch (err) {
      if (esErrorDeRed(err)) {
        encolarMensaje(payload);
        setQueuedMensaje(payload);
        setQueued(true);
        setSent(true);
      } else {
        setError(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contacto" className="border-border relative isolate overflow-hidden border-t">
      <div className="absolute inset-0 z-0 opacity-40" aria-hidden="true">
        <LatticeCanvas density={0.7} interactive={false} />
      </div>
      <div className="theme-scrim-soft absolute inset-0 z-0" aria-hidden="true" />

      <div className="relative z-[1] mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <div className="grid gap-14 md:grid-cols-2 md:items-start">
          <div>
            <Reveal
              as="h2"
              className="text-foreground text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl"
              style={{ textWrap: 'balance' }}
            >
              Conversemos sobre tu proyecto
            </Reveal>
            <Reveal as="p" className="text-subtle-foreground mt-5 max-w-md text-lg leading-relaxed">
              Cuéntanos qué necesitas y te contactamos en menos de dos días hábiles.
            </Reveal>
            <Reveal className="mt-9 flex flex-col gap-4" delay={80}>
              <a
                href="mailto:hola@latticesystems.dev"
                className="press text-foreground group flex w-fit items-center gap-3 text-sm"
              >
                <span
                  className="flex size-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-translate-y-0.5"
                  style={{
                    color: 'var(--accent-2)',
                    background: 'color-mix(in srgb, var(--accent-2) 12%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--accent-2) 34%, transparent)',
                  }}
                >
                  <Mail size={18} />
                </span>
                <span className="signal-underline pb-0.5">hola@latticesystems.dev</span>
              </a>
              <a
                href="https://www.linkedin.com/company/lattice-systems"
                target="_blank"
                rel="noopener"
                className="press text-foreground group flex w-fit items-center gap-3 text-sm"
              >
                <span
                  className="flex size-10 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-translate-y-0.5"
                  style={{
                    color: 'var(--accent-1)',
                    background: 'color-mix(in srgb, var(--accent-1) 12%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--accent-1) 34%, transparent)',
                  }}
                >
                  <Linkedin size={18} />
                </span>
                <span className="signal-underline pb-0.5">Lattice Systems en LinkedIn</span>
              </a>
            </Reveal>
          </div>

          <Reveal
            kind="scale"
            className="border-border bg-card/80 rounded-3xl border p-7 backdrop-blur-sm sm:p-8"
          >
            {!sent ? (
              <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-foreground text-sm font-medium">
                    Nombre
                  </label>
                  <Input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    onBlur={() => onBlur('name')}
                    placeholder="Tu nombre"
                    autoComplete="name"
                    aria-invalid={invalid('name')}
                    aria-describedby={invalid('name') ? 'err-name' : undefined}
                  />
                  {invalid('name') && (
                    <p id="err-name" className="text-destructive text-xs">
                      Escribe tu nombre.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-foreground text-sm font-medium">
                    Correo
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    onBlur={() => onBlur('email')}
                    placeholder="tucorreo@empresa.com"
                    autoComplete="email"
                    aria-invalid={invalid('email')}
                    aria-describedby={invalid('email') ? 'err-email' : undefined}
                  />
                  {invalid('email') && (
                    <p id="err-email" className="text-destructive text-xs">
                      Escribe un correo válido.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-foreground text-sm font-medium">
                    Cuéntanos sobre tu proyecto
                  </label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    value={values.message}
                    onChange={(e) => onChange('message', e.target.value)}
                    rows={4}
                    placeholder="¿Qué te gustaría construir?"
                  />
                </div>

                <Button type="submit" className="mt-1 w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <LoaderCircle className="animate-spin" />
                      Enviando
                    </>
                  ) : (
                    'Enviar mensaje'
                  )}
                </Button>
                {error && (
                  <p className="text-destructive text-xs">
                    No se pudo enviar tu mensaje. Intenta de nuevo o escríbenos directo a
                    hola@latticesystems.dev.
                  </p>
                )}
              </form>
            ) : (
              <>
                <div className="flex flex-col items-start gap-4 py-4">
                  <span className="border-signal/40 bg-signal-soft text-signal flex size-11 items-center justify-center rounded-full border">
                    {queued ? <LoaderCircle size={20} /> : <Check size={20} />}
                  </span>
                  <div>
                    {queued ? (
                      <>
                        <p className="text-foreground font-semibold">Mensaje en cola (sin conexión).</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          Se enviará solo en cuanto vuelva la conexión, no necesitas hacer nada más.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-foreground font-semibold">Mensaje recibido.</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          Te contactamos en menos de dos días hábiles.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {ultimoEnviado ? (
                  <div className="border-border bg-muted/50 mt-2 rounded-xl border p-4 text-sm">
                    <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
                      Esto fue lo que guardamos (demo, sin envío real de correo)
                    </p>
                    <p className="text-foreground mt-2">
                      <span className="font-semibold">{ultimoEnviado.name}</span>
                      <span className="text-muted-foreground"> · {ultimoEnviado.email}</span>
                    </p>
                    {ultimoEnviado.message && (
                      <p className="text-subtle-foreground mt-1">{ultimoEnviado.message}</p>
                    )}
                    <p className="text-muted-foreground mt-2 text-xs">
                      Guardado {FORMATO_FECHA.format(new Date(ultimoEnviado.recibidoEn))} · id{' '}
                      {ultimoEnviado.id}
                    </p>
                  </div>
                ) : (
                  queuedMensaje && (
                    <div className="border-border bg-muted/50 mt-2 rounded-xl border p-4 text-sm">
                      <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
                        En espera de conexión
                      </p>
                      <p className="text-foreground mt-2">
                        <span className="font-semibold">{queuedMensaje.name}</span>
                        <span className="text-muted-foreground"> · {queuedMensaje.email}</span>
                      </p>
                      {queuedMensaje.message && (
                        <p className="text-subtle-foreground mt-1">{queuedMensaje.message}</p>
                      )}
                    </div>
                  )
                )}
              </>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
