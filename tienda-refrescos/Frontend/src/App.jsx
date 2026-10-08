import { useEffect, useRef, useState } from "react";
import { useOnline } from "./useOnline.js";

const formatoMoneda = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
const formatoFecha = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" });

const FILTROS = [
  { id: "todas", etiqueta: "Todas" },
  { id: "Cola", etiqueta: "Cola" },
  { id: "Citricos", etiqueta: "Citricos" },
  { id: "Frutales", etiqueta: "Frutales" },
  { id: "Otros", etiqueta: "Otros" }
];

function leerLocal(clave, porDefecto) {
  try {
    return JSON.parse(localStorage.getItem(clave) || porDefecto);
  } catch {
    return JSON.parse(porDefecto);
  }
}

function generarClienteId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function enviarPedido(items, clienteId) {
  const res = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, clienteId })
  });
  if (!res.ok) throw new Error("respuesta no ok");
  return res.json();
}

export default function App() {
  const online = useOnline();

  const [refrescos, setRefrescos] = useState([]);
  const [carrito, setCarrito] = useState(() => leerLocal("carrito", "{}"));
  const [filtro, setFiltro] = useState("todas");
  const [pedidosPendientes, setPedidosPendientes] = useState(() =>
    leerLocal("pedidos-pendientes", "[]")
  );
  const [historial, setHistorial] = useState([]);
  const [historialCargado, setHistorialCargado] = useState(false);
  const [resultadoPedido, setResultadoPedido] = useState("");
  const [enviando, setEnviando] = useState(false);

  // La cola de pedidos se lee de localStorage en cada paso para que la
  // sincronizacion (asincrona) siempre vea el estado mas reciente.
  const sincronizandoRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  function guardarPedidosPendientes(lista) {
    localStorage.setItem("pedidos-pendientes", JSON.stringify(lista));
    setPedidosPendientes(lista);
  }

  async function cargarRefrescos() {
    try {
      const res = await fetch("/api/refrescos");
      const datos = await res.json();
      setRefrescos(datos);
      localStorage.setItem("refrescos-cache", JSON.stringify(datos));
    } catch {
      setRefrescos(leerLocal("refrescos-cache", "[]"));
    }
  }

  async function cargarHistorial() {
    let pedidos = [];
    try {
      const res = await fetch("/api/pedidos");
      pedidos = await res.json();
      localStorage.setItem("historial-cache", JSON.stringify(pedidos));
    } catch {
      pedidos = leerLocal("historial-cache", "[]");
    }
    setHistorial(pedidos);
    setHistorialCargado(true);
  }

  async function sincronizarPedidos() {
    if (sincronizandoRef.current) return;
    if (leerLocal("pedidos-pendientes", "[]").length === 0) return;
    sincronizandoRef.current = true;

    while (true) {
      const cola = leerLocal("pedidos-pendientes", "[]");
      if (cola.length === 0) break;
      const pendiente = cola[0];
      try {
        const pedido = await enviarPedido(pendiente.items, pendiente.clienteId);
        guardarPedidosPendientes(
          leerLocal("pedidos-pendientes", "[]").filter((p) => p.clienteId !== pendiente.clienteId)
        );
        setResultadoPedido(
          `Pedido #${pedido.pedidoId} (en cola) confirmado. Total: ${formatoMoneda.format(pedido.total)}`
        );
        cargarHistorial();
      } catch {
        break; // seguimos sin conexion, reintentamos mas tarde
      }
    }

    sincronizandoRef.current = false;
  }

  useEffect(() => {
    cargarRefrescos().then(sincronizarPedidos);
    cargarHistorial();

    const alConectar = () => sincronizarPedidos();
    window.addEventListener("online", alConectar);
    return () => window.removeEventListener("online", alConectar);
  }, []);

  function agregarAlCarrito(id) {
    setCarrito((actual) => ({ ...actual, [id]: (actual[id] || 0) + 1 }));
  }

  function quitarDelCarrito(id) {
    setCarrito((actual) => {
      const copia = { ...actual };
      delete copia[id];
      return copia;
    });
  }

  async function confirmarPedido() {
    if (enviando) return; // evita doble envio por doble clic

    const items = Object.entries(carrito).map(([id, cantidad]) => ({ id, cantidad }));
    if (items.length === 0) {
      setResultadoPedido("Agrega productos antes de confirmar.");
      return;
    }

    const clienteId = generarClienteId();
    setEnviando(true);

    try {
      const pedido = await enviarPedido(items, clienteId);
      setResultadoPedido(
        `Pedido #${pedido.pedidoId} confirmado. Total: ${formatoMoneda.format(pedido.total)}`
      );
      setCarrito({});
      cargarHistorial();
    } catch {
      guardarPedidosPendientes([
        ...leerLocal("pedidos-pendientes", "[]"),
        { items, clienteId, creadoEn: new Date().toISOString() }
      ]);
      setResultadoPedido(
        "Sin conexion: tu pedido quedo en cola y se enviara automaticamente al reconectar."
      );
      setCarrito({});
    } finally {
      setEnviando(false);
    }
  }

  const refrescosFiltrados =
    filtro === "todas" ? refrescos : refrescos.filter((r) => r.categoria === filtro);

  const ids = Object.keys(carrito);
  const cantidadTotal = ids.reduce((acc, id) => acc + carrito[id], 0);
  let totalPrecio = 0;
  const itemsCarrito = ids.map((id) => {
    const refresco = refrescos.find((r) => r.id === id);
    if (!refresco) return null;
    const cantidad = carrito[id];
    const subtotal = refresco.precio * cantidad;
    totalPrecio += subtotal;
    return (
      <div className="item-carrito" key={id}>
        <span>
          {refresco.nombre} x{cantidad}
        </span>
        <span>
          {formatoMoneda.format(subtotal)} <button onClick={() => quitarDelCarrito(id)}>Quitar</button>
        </span>
      </div>
    );
  });

  return (
    <>
      <header>
        <h1>Tienda de Refrescos</h1>
        <p id="estado-conexion" className={`offline-badge${online ? " oculto" : ""}`}>
          Modo offline
        </p>
      </header>

      <div className="layout">
        <main>
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

          <div id="grid-refrescos" className="grid">
            {refrescosFiltrados.map((refresco) => (
              <div className="tarjeta" key={refresco.id}>
                <img src={refresco.imagen} alt={refresco.nombre} loading="lazy" />
                <h3>{refresco.nombre}</h3>
                <span className="sabor">{refresco.sabor}</span>
                <span className="precio">{formatoMoneda.format(refresco.precio)}</span>
                <button onClick={() => agregarAlCarrito(refresco.id)}>Agregar</button>
              </div>
            ))}
            {refrescosFiltrados.length === 0 && refrescos.length > 0 && (
              <p>No hay refrescos en esta categoria.</p>
            )}
          </div>
        </main>

        <aside id="panel-carrito" className="panel-carrito">
          <h2>
            Tu carrito (<span id="contador-carrito">{cantidadTotal}</span>)
          </h2>
          <div id="items-carrito">
            {ids.length === 0 ? <p>Tu carrito esta vacio.</p> : itemsCarrito}
          </div>
          <p id="total-carrito">
            {ids.length === 0 ? "" : `Total: ${formatoMoneda.format(totalPrecio)}`}
          </p>
          <button id="confirmar-pedido" className="btn-confirmar" disabled={enviando} onClick={confirmarPedido}>
            Confirmar pedido
          </button>
          <div id="resultado-pedido">{resultadoPedido}</div>
          {pedidosPendientes.length > 0 && (
            <p className="aviso-pendiente">
              {pedidosPendientes.length === 1
                ? "1 pedido en cola, se enviara cuando vuelva la conexion."
                : `${pedidosPendientes.length} pedidos en cola, se enviaran cuando vuelva la conexion.`}
            </p>
          )}
        </aside>
      </div>

      <section className="historial">
        <h2>Historial de pedidos</h2>
        <div id="lista-historial">
          {historial.map((pedido) => (
            <div className="pedido-historial" key={pedido.pedidoId}>
              <div className="cabecera">
                <span>Pedido #{pedido.pedidoId}</span>
                <span>{formatoMoneda.format(pedido.total)}</span>
              </div>
              <div className="detalle-items">
                {pedido.detalle.map((d) => `${d.nombre} x${d.cantidad}`).join(", ")} ·{" "}
                {formatoFecha.format(new Date(pedido.creadoEn))}
              </div>
            </div>
          ))}
          {historialCargado && historial.length === 0 && <p>Aun no tienes pedidos confirmados.</p>}
        </div>
      </section>
    </>
  );
}
