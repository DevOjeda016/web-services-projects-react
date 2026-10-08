import { useEffect, useRef } from 'react';
import { createLattice } from './lattice';

interface LatticeCanvasProps {
  /** Roughly how dense the mesh is; node count scales with area up to a cap. */
  density?: number;
  /** Whether the mesh reacts to the pointer. */
  interactive?: boolean;
}

export function LatticeCanvas({ density = 0.9, interactive = true }: LatticeCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!hostRef.current || !canvasRef.current) return;
    return createLattice(hostRef.current, canvasRef.current, { density, interactive });
  }, [density, interactive]);

  return (
    <div ref={hostRef} className="block h-full w-full">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
