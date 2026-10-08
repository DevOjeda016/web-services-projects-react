interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Pulse {
  a: number;
  b: number;
  t: number;
  speed: number;
}

type RGB = [number, number, number];

export interface LatticeOptions {
  /** Roughly how dense the mesh is; node count scales with area up to a cap. */
  density: number;
  /** Whether the mesh reacts to the pointer. */
  interactive: boolean;
}

/*
  The Lattice — the brand's literal namesake rendered live: nodes drifting on a
  mesh, edges forming between neighbours, and a "signal" travelling the graph.
  This is identity, not a decorative CSS grid overlay. The render loop pauses
  when hidden or offscreen, and collapses to a single static frame under
  prefers-reduced-motion.

  Returns a destroy function that releases every observer / listener / frame.
*/
export function createLattice(
  hostEl: HTMLElement,
  canvas: HTMLCanvasElement,
  options: LatticeOptions,
): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let nodes: Node[] = [];
  let pulses: Pulse[] = [];
  let raf = 0;
  let w = 0;
  let h = 0;
  let dpr = 1;
  const pointer = { x: -9999, y: -9999, active: false };
  let lastPulse = 0;
  let running = false;
  let onScreen = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lineC: RGB = [120, 168, 196];
  let nodeC: RGB = [150, 190, 214];
  let pulseC: RGB = [193, 206, 217];

  const linkDist = () => Math.min(180, Math.max(120, w / 9));

  function readColors(): void {
    const style = getComputedStyle(hostEl);
    const parse = (name: string, fallback: RGB): RGB => {
      const raw = style.getPropertyValue(name).trim();
      const parts = raw
        .split(/[\s,]+/)
        .map(Number)
        .filter((n) => !Number.isNaN(n));
      return parts.length === 3 ? (parts as RGB) : fallback;
    };
    lineC = parse('--lattice-line', lineC);
    nodeC = parse('--lattice-node', nodeC);
    pulseC = parse('--lattice-pulse', pulseC);
  }

  function measure(): void {
    const rect = hostEl.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed(): void {
    const target = Math.round(Math.min(72, Math.max(14, (w * h) / 20000) * options.density));
    nodes = Array.from({ length: target }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
    }));
    pulses = [];
  }

  function step(time: number): void {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      n.x = Math.max(0, Math.min(w, n.x));
      n.y = Math.max(0, Math.min(h, n.y));

      if (pointer.active) {
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000 && d2 > 1) {
          const f = (14000 - d2) / 14000 / Math.sqrt(d2);
          n.x += dx * f * 1.4;
          n.y += dy * f * 1.4;
        }
      }
    }

    // Spawn a pulse along a real edge every ~1.3s, up to 3 concurrent.
    if (time - lastPulse > 1300 && pulses.length < 3 && nodes.length > 2) {
      lastPulse = time;
      const a = Math.floor(Math.random() * nodes.length);
      const link = linkDist();
      const candidates: number[] = [];
      for (let b = 0; b < nodes.length; b++) {
        if (b === a) continue;
        const dx = nodes[a].x - nodes[b].x;
        const dy = nodes[a].y - nodes[b].y;
        if (dx * dx + dy * dy < link * link) candidates.push(b);
      }
      if (candidates.length) {
        pulses.push({
          a,
          b: candidates[Math.floor(Math.random() * candidates.length)],
          t: 0,
          speed: 0.012 + Math.random() * 0.01,
        });
      }
    }
    for (const p of pulses) p.t += p.speed;
    pulses = pulses.filter((p) => p.t < 1);
  }

  function drawFrame(): void {
    const c = ctx!;
    c.clearRect(0, 0, w, h);
    const link = linkDist();
    const [lr, lg, lb] = lineC;
    const [nr, ng, nb] = nodeC;
    const [pr, pg, pb] = pulseC;

    // Edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < link * link) {
          const alpha = (1 - Math.sqrt(d2) / link) * 0.24;
          c.strokeStyle = `rgba(${lr}, ${lg}, ${lb}, ${alpha})`;
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(a.x, a.y);
          c.lineTo(b.x, b.y);
          c.stroke();
        }
      }
    }

    // Nodes
    c.fillStyle = `rgba(${nr}, ${ng}, ${nb}, 0.5)`;
    for (const n of nodes) {
      c.beginPath();
      c.arc(n.x, n.y, 1.4, 0, Math.PI * 2);
      c.fill();
    }

    // Signal pulses travelling the graph + lit endpoints
    for (const p of pulses) {
      const a = nodes[p.a];
      const b = nodes[p.b];
      if (!a || !b) continue;
      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;
      const fade = Math.sin(p.t * Math.PI);

      c.strokeStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.32 * fade})`;
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(a.x, a.y);
      c.lineTo(b.x, b.y);
      c.stroke();

      c.beginPath();
      c.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.95 * fade})`;
      c.shadowColor = `rgba(${pr}, ${pg}, ${pb}, 0.9)`;
      c.shadowBlur = 8;
      c.arc(x, y, 2.1, 0, Math.PI * 2);
      c.fill();
      c.shadowBlur = 0;
    }
  }

  function tick(time: number): void {
    if (!running) return;
    step(time);
    drawFrame();
    raf = requestAnimationFrame(tick);
  }

  function syncRunning(): void {
    const shouldRun = onScreen && !document.hidden && !reduce;
    if (shouldRun && !running) {
      running = true;
      raf = requestAnimationFrame(tick);
    } else if (!shouldRun && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  }

  const onVisibility = () => syncRunning();
  const onPointerMove = (e: PointerEvent) => {
    const rect = hostEl.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active = true;
  };
  const onPointerLeave = () => {
    pointer.active = false;
  };

  readColors();
  measure();
  seed();

  // Re-read palette when the page theme (light/dark) flips.
  const themeObs = new MutationObserver(() => {
    readColors();
    if (reduce || !running) drawFrame();
  });
  themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  const resizeObs = new ResizeObserver(() => {
    measure();
    seed();
    if (reduce || !running) drawFrame();
  });
  resizeObs.observe(hostEl);

  let intersectObs: IntersectionObserver | undefined;

  if (reduce) {
    drawFrame();
  } else {
    intersectObs = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        syncRunning();
      },
      { threshold: 0 },
    );
    intersectObs.observe(hostEl);

    document.addEventListener('visibilitychange', onVisibility);
    if (options.interactive) {
      hostEl.addEventListener('pointermove', onPointerMove);
      hostEl.addEventListener('pointerleave', onPointerLeave);
    }
    syncRunning();
  }

  return () => {
    cancelAnimationFrame(raf);
    running = false;
    resizeObs.disconnect();
    intersectObs?.disconnect();
    themeObs.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    hostEl.removeEventListener('pointermove', onPointerMove);
    hostEl.removeEventListener('pointerleave', onPointerLeave);
  };
}
