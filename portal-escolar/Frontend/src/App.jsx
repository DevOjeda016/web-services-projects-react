import { useEffect, useState } from "react";
import { useOnline } from "./useOnline.js";

const TABS = [
  { vista: "inicio", etiqueta: "Inicio" },
  { vista: "calificaciones", etiqueta: "Calificaciones" },
  { vista: "datos-personales", etiqueta: "Datos Personales" }
];

function Fila({ etiqueta, valor }) {
  return (
    <div className="fila">
      <span>{etiqueta}</span>
      <span>{valor}</span>
    </div>
  );
}

function ResumenAlumno({ alumno }) {
  return (
    <>
      <h2>Bienvenido, {alumno.nombre}</h2>
      <div className="promedios">
        <div className="promedio-card">
          <div className="valor">{alumno.promedioGeneralIng}</div>
          <div className="etiqueta">Promedio Ingeniería</div>
        </div>
        <div className="promedio-card">
          <div className="valor">{alumno.promedioGeneralTSU}</div>
          <div className="etiqueta">Promedio TSU</div>
        </div>
      </div>
      <Fila etiqueta="Matrícula" valor={alumno.matricula} />
      <Fila etiqueta="Grupo actual" valor={alumno.grupoActual} />
      <Fila etiqueta="Estatus académico" valor={alumno.estatusAcademico} />
      <Fila etiqueta="Estatus de inscripción" valor={alumno.estatusInscripcion} />
      <Fila etiqueta="Estatus de pago" valor={alumno.estatusPago} />
      <Fila etiqueta="Carrera Ingeniería" valor={alumno.carreraIngenieria} />
      <Fila etiqueta="Carrera TSU" valor={alumno.carreraTSU} />
    </>
  );
}

function GrupoCalificaciones({ grupo }) {
  return (
    <div className="grado-card">
      <div className="grado-cabecera">
        <h3>
          {grupo.nivel} · Grado {grupo.grado} · {grupo.periodo} · Grupo {grupo.grupo}
        </h3>
        <span className="badge-promedio">Promedio: {grupo.promedioCuatrimestral}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Calificación final</th>
          </tr>
        </thead>
        <tbody>
          {grupo.materias.map((m) => (
            <tr key={m.materia}>
              <td>{m.materia}</td>
              <td className="cal-final">{m.calFinal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="dato-card">
      <span className="etiqueta">{etiqueta}</span>
      <span className="valor">{valor}</span>
    </div>
  );
}

function DatosPersonales({ alumno }) {
  const dp = alumno.datosPersonales;
  const dom = alumno.domicilio;

  return (
    <div className="datos-grid">
      <div className="nota">
        Cualquier cambio de datos personales debe solicitarse a servicios escolares.
      </div>
      <Dato etiqueta="Nombre completo" valor={dp.nombre} />
      <Dato etiqueta="Fecha de nacimiento" valor={dp.fechaNacimiento} />
      <Dato etiqueta="Sexo" valor={dp.sexo} />
      <Dato etiqueta="CURP" valor={dp.curp} />
      <Dato etiqueta="Correo electrónico" valor={dp.correo} />
      <Dato etiqueta="Celular" valor={dp.celular} />
      <Dato etiqueta="Estado civil" valor={dp.estadoCivil} />
      <Dato etiqueta="Nacionalidad" valor={dp.nacionalidad} />
      <Dato etiqueta="País" valor={dp.pais} />
      <Dato etiqueta="Estado" valor={dp.estado} />
      <Dato etiqueta="Ciudad de origen" valor={dp.ciudadOrigen} />
      <Dato
        etiqueta="Domicilio"
        valor={`${dom.calle} #${dom.numero}, ${dom.colonia}, ${dom.ciudad}, ${dom.estado}`}
      />
    </div>
  );
}

async function obtenerDatos() {
  try {
    const [resAlumno, resCalificaciones] = await Promise.all([
      fetch("/api/alumno"),
      fetch("/api/calificaciones")
    ]);
    const alumno = await resAlumno.json();
    const calificaciones = await resCalificaciones.json();
    localStorage.setItem("alumno-cache", JSON.stringify(alumno));
    localStorage.setItem("calificaciones-cache", JSON.stringify(calificaciones));
    return { alumno, calificaciones };
  } catch {
    const alumnoCache = localStorage.getItem("alumno-cache");
    const calificacionesCache = localStorage.getItem("calificaciones-cache");
    if (!alumnoCache || !calificacionesCache) return null;
    return { alumno: JSON.parse(alumnoCache), calificaciones: JSON.parse(calificacionesCache) };
  }
}

export default function App() {
  const online = useOnline();
  const [vista, setVista] = useState("inicio");
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerDatos().then((resultado) => {
      setDatos(resultado);
      setCargando(false);
    });
  }, []);

  return (
    <>
      <header>
        <h1>Portal Escolar</h1>
        <p id="estado-conexion" className={`offline-badge${online ? " oculto" : ""}`}>
          Modo offline
        </p>
        <nav className="tabs">
          {TABS.map((tab) => (
            <button
              key={tab.vista}
              className={`tab${vista === tab.vista ? " activo" : ""}`}
              onClick={() => setVista(tab.vista)}
            >
              {tab.etiqueta}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <section id="vista-inicio" className={`vista${vista === "inicio" ? " activa" : ""}`}>
          <div id="resumen-alumno" className="tarjeta-resumen">
            {datos && <ResumenAlumno alumno={datos.alumno} />}
            {!datos && !cargando && <p>Sin conexion y sin datos en cache todavia.</p>}
          </div>
        </section>

        <section
          id="vista-calificaciones"
          className={`vista${vista === "calificaciones" ? " activa" : ""}`}
        >
          <h2>Historial de Calificaciones</h2>
          <div id="lista-calificaciones">
            {datos &&
              datos.calificaciones.map((grupo) => (
                <GrupoCalificaciones
                  key={`${grupo.nivel}-${grupo.grado}-${grupo.periodo}-${grupo.grupo}`}
                  grupo={grupo}
                />
              ))}
          </div>
        </section>

        <section
          id="vista-datos-personales"
          className={`vista${vista === "datos-personales" ? " activa" : ""}`}
        >
          <h2>Datos Personales</h2>
          <div id="datos-personales">{datos && <DatosPersonales alumno={datos.alumno} />}</div>
        </section>
      </main>
    </>
  );
}
