import { useEffect, useState } from "react";
import { useOnline } from "./useOnline.js";

function encontrarSignoPorFecha(signos, dia, mes) {
  if (!dia || !mes || mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;

  const fecha = `${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

  return signos.find((s) => {
    if (s.fechaInicio <= s.fechaFin) {
      return fecha >= s.fechaInicio && fecha <= s.fechaFin;
    }
    return fecha >= s.fechaInicio || fecha <= s.fechaFin;
  });
}

function leerCache() {
  try {
    return JSON.parse(localStorage.getItem("signos-cache") || "[]");
  } catch {
    return [];
  }
}

export default function App() {
  const online = useOnline();
  const [signos, setSignos] = useState(leerCache);
  const [cargando, setCargando] = useState(true);
  const [signoAbierto, setSignoAbierto] = useState(null);
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [resultado, setResultado] = useState(null); // null = sin buscar, false = no encontrado

  useEffect(() => {
    async function cargarSignos() {
      try {
        const res = await fetch("/api/signos");
        const datos = await res.json();
        setSignos(datos);
        localStorage.setItem("signos-cache", JSON.stringify(datos));
      } catch {
        // sin conexion: seguimos con lo que ya habia en cache local
      }
      setCargando(false);
    }
    cargarSignos();
  }, []);

  function buscar(e) {
    e.preventDefault();
    const signo = encontrarSignoPorFecha(signos, parseInt(dia, 10), parseInt(mes, 10));
    setResultado(signo || false);
  }

  return (
    <>
      <header>
        <h1>Zodiaco</h1>
        <p id="estado-conexion" className={`offline-badge${online ? " oculto" : ""}`}>
          Modo offline
        </p>
      </header>

      <main>
        <section className="buscador">
          <h2>Encuentra tu signo</h2>
          <form id="form-fecha" onSubmit={buscar}>
            <label>
              Dia
              <input
                type="number"
                id="dia"
                min="1"
                max="31"
                required
                value={dia}
                onChange={(e) => setDia(e.target.value)}
              />
            </label>
            <label>
              Mes
              <input
                type="number"
                id="mes"
                min="1"
                max="12"
                required
                value={mes}
                onChange={(e) => setMes(e.target.value)}
              />
            </label>
            <button type="submit">Buscar</button>
          </form>
          <div id="resultado-busqueda">
            {resultado === false && "No se pudo encontrar el signo para esa fecha."}
            {resultado && (
              <>
                Tu signo es{" "}
                <strong>
                  {resultado.nombre} {resultado.simbolo}
                </strong>
              </>
            )}
          </div>
        </section>

        <section>
          <h2>Los 12 signos</h2>
          <div id="grid-signos" className="grid">
            {signos.map((signo) => (
              <div key={signo.id} className="tarjeta" onClick={() => setSignoAbierto(signo)}>
                <img src={signo.imagen} alt={signo.nombre} />
                <h3>{signo.nombre}</h3>
                <span>{signo.simbolo}</span>
              </div>
            ))}
            {!cargando && signos.length === 0 && <p>No se pudieron cargar los signos.</p>}
          </div>
        </section>
      </main>

      <div
        id="modal"
        className={`modal${signoAbierto ? "" : " oculto"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSignoAbierto(null);
        }}
      >
        <div className="modal-contenido">
          <button id="cerrar-modal" className="cerrar" onClick={() => setSignoAbierto(null)}>
            &times;
          </button>
          <div id="detalle-signo">
            {signoAbierto && (
              <>
                <img src={signoAbierto.imagen} alt={signoAbierto.nombre} />
                <h2>
                  {signoAbierto.nombre} {signoAbierto.simbolo}
                </h2>
                <p className="meta">
                  {signoAbierto.elemento} · Regido por {signoAbierto.regente} ·{" "}
                  {signoAbierto.fechaInicio} a {signoAbierto.fechaFin}
                </p>
                <p>{signoAbierto.cartaAstral}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
