import { createElement, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { cn } from '../lib/utils';

/*
  Progressive-enhancement scroll reveal. The element ships fully visible; this
  component only arms the hidden start-state once JS runs and motion is allowed,
  then releases it when the element scrolls into view. Honors reduced-motion by
  never arming at all. See [data-reveal] rules in styles.css.
*/
interface RevealProps {
  /** Etiqueta a renderizar (div por defecto). */
  as?: ElementType;
  /** Stagger offset in ms, applied via --reveal-delay. */
  delay?: number;
  /** Entrance flavour: '' (up), 'left', 'right', 'scale', 'blur', 'fade'. */
  kind?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export function Reveal({ as = 'div', delay = 0, kind = '', className, style, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    const reduce =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || typeof IntersectionObserver === 'undefined') return;

    setArmed(true);

    const reveal = () => {
      setVisible(true);
      observer.disconnect();
      clearTimeout(safety);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal();
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);

    // Safety net: nothing stays hidden permanently if the observer never fires
    // (headless capture, background tab, slow scroll). Scrolling reveals earlier.
    const safety = setTimeout(reveal, 1600);

    return () => {
      observer.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return createElement(
    as,
    {
      ref,
      'data-reveal': '',
      'data-kind': armed && kind ? kind : undefined,
      className: cn(className, armed && 'reveal-armed', visible && 'is-visible'),
      style: armed ? ({ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties) : style,
    },
    children,
  );
}
