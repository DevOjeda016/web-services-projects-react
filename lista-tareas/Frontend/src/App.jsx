import { useEffect, useRef, useState } from "react";
import { useOnline } from "./useOnline.js";

const CACHE_KEY = "tareas-cache";
const COLA_KEY = "cola-sync";

const FILTROS = [
  { id: "todas", etiqueta: "Todas" },
  { id: "pendientes", etiqueta: "Pendientes" },
  { id: "completadas", etiqueta: "Completadas" }
];

function leerLocal(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave) || "[]");
  } catch {
    return [];
  }
}

export default function App() {
  const online = useOnline();

  // La lista y la cola de operaciones pendientes viven en refs para que la
  // sincronizacion (asincrona) siempre vea el estado mas reciente.
  const tareasRef = useRef(leerLocal(CACHE_KEY));
  const colaRef = useRef(leerLocal(COLA_KEY));
  const sincronizandoRef = useRef(false);

  const [tareas, setTareas] = useState(tareasRef.current);
  const [filtro, setFiltro] = useState("todas");
  const [texto, setTexto] = useState("");

  function actualizarTareas(fn) {
    tareasRef.current = fn(tareasRef.current);
    setTareas(tareasRef.current);
    localStorage.setItem(CACHE_KEY, JSON.stringify(tareasRef.current));
  }

  function guardarCola() {
    localStorage.setItem(COLA_KEY, JSON.stringify(colaRef.current));
  }

  function agregarACola(operacion) {
    colaRef.current.push(operacion);
    guardarCola();
  }

  async function sincronizar() {
    if (sincronizandoRef.current || colaRef.current.length === 0) return;
    sincronizandoRef.current = true;

    while (colaRef.current.length > 0) {
      const operacion = colaRef.current[0];

      try {
        if (operacion.tipo === "crear") {
          const res = await fetch("/api/tareas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto: operacion.texto })
          });
          if (!res.ok) throw new Error("fallo al crear");
          const tareaCreada = await res.json();

          actualizarTareas((lista) =>
            lista.map((t) => (t.id === operacion.tempId ? tareaCreada : t))
          );
        }

        if (operacion.tipo === "actualizar") {
          const res = await fetch(`/api/tareas/${operacion.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(operacion.cambios)
          });
          if (!res.ok) throw new Error("fallo al actualizar");
        }

        if (operacion.tipo === "eliminar") {
          const res = await fetch(`/api/tareas/${operacion.id}`, { method: "DELETE" });
          if (!res.ok && res.status !== 404) throw new Error("fallo al eliminar");
        }

        colaRef.current = colaRef.current.filter((op) => op !== operacion);
        guardarCola();
      } catch {
        break; // seguimos offline o el servidor no responde, reintentamos mas tarde
      }
    }

    sincronizandoRef.current = false;
  }

  async function cargarTareas() {
    try {
      const res = await fetch("/api/tareas");
      if (!res.ok) throw new Error("respuesta no ok");
      const servidor = await res.json();

      const idsEnCola = new Set(
        colaRef.current.filter((op) => op.tipo === "crear").map((op) => op.tempId)
      );
      actualizarTareas((lista) => [...servidor, ...lista.filter((t) => idsEnCola.has(t.id))]);
    } catch {
      // sin conexion: nos quedamos con lo que hay en cache local
    }
  }

  useEffect(() => {
    cargarTareas().then(sincronizar);

    const alConectar = () => sincronizar();
    window.addEventListener("online", alConectar);
    return () => window.removeEventListener("online", alConectar);
  }, []);

  function agregarTarea(e) {
    e.preventDefault();
    const limpio = texto.trim();
    if (!limpio) return;

    const tempId = "tmp-" + Date.now().toString();
    actualizarTareas((lista) => [
      ...lista,
      { id: tempId, texto: limpio, completada: false, pendienteSync: true }
    ]);
    setTexto("");

    agregarACola({ tipo: "crear", tempId, texto: limpio });
    sincronizar();
  }

  function alternarTarea(id) {
    const tarea = tareasRef.current.find((t) => t.id === id);
    if (!tarea) return;
    const completada = !tarea.completada;
    actualizarTareas((lista) => lista.map((t) => (t.id === id ? { ...t, completada } : t)));

    if (id.startsWith("tmp-")) {
      const pendiente = colaRef.current.find((op) => op.tipo === "crear" && op.tempId === id);
      if (pendiente) {
        pendiente.completadaInicial = completada;
        guardarCola();
      }
    } else {
      agregarACola({ tipo: "actualizar", id, cambios: { completada } });
    }
    sincronizar();
  }

  function eliminarTarea(id) {
    actualizarTareas((lista) => lista.filter((t) => t.id !== id));

    if (id.startsWith("tmp-")) {
      colaRef.current = colaRef.current.filter((op) => !(op.tipo === "crear" && op.tempId === id));
    } else {
      colaRef.current.push({ tipo: "eliminar", id });
    }
    guardarCola();
    sincronizar();
  }

  const visibles =
    filtro === "pendientes"
      ? tareas.filter((t) => !t.completada)
      : filtro === "completadas"
        ? tareas.filter((t) => t.completada)
        : tareas;

  const pendientes = tareas.filter((t) => !t.completada).length;

  return (
    <>
      <header>
        <h1>Mis Tareas</h1>
        <p id="estado-conexion" className={`offline-badge${online ? " oculto" : ""}`}>
          Modo offline
        </p>
      </header>

      <main>
        <form id="form-tarea" onSubmit={agregarTarea}>
          <input
            type="text"
            id="input-tarea"
            placeholder="Escribe una nueva tarea..."
            required
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <button type="submit">Agregar</button>
        </form>

        <div className="filtros">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              className={`filtro${filtro === f.id ? " activo" : ""}`}
              onClick={() => setFiltro(f.id)}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>

        <ul id="lista-tareas">
          {visibles.map((tarea) => (
            <li key={tarea.id} className={`tarea${tarea.completada ? " completada" : ""}`}>
              <input
                type="checkbox"
                checked={tarea.completada}
                onChange={() => alternarTarea(tarea.id)}
              />
              <span>
                {tarea.texto}
                {tarea.pendienteSync ? " ⏳" : ""}
              </span>
              <button aria-label="Eliminar" onClick={() => eliminarTarea(tarea.id)}>
                &times;
              </button>
            </li>
          ))}
        </ul>

        <p id="contador-tareas">
          {tareas.length
            ? `${pendientes} pendiente(s) de ${tareas.length} tarea(s)`
            : "No tienes tareas todavia"}
        </p>
      </main>
    </>
  );
}
