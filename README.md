# Web Services Projects (React)

Cinco proyectos web, cada uno con un **backend Express** y un **frontend en React** (Vite), sin Service Worker. Es la versión en React del repositorio `webservices-projets`.

| Proyecto | Carpeta | Puerto | Frontend |
|---|---|---|---|
| Zodiaco | `zodiaco` | 3000 | React + Vite |
| Tienda de Refrescos | `tienda-refrescos` | 3001 | React + Vite |
| Lista de Tareas | `lista-tareas` | 3002 | React + Vite |
| Portal Escolar | `portal-escolar` | 3003 | React + Vite |
| Lattice Systems | `lattice-systems-web-frontend` | 3004 | React + Vite + TypeScript + Tailwind v4 |

## Requisitos

- **Git**
- **Node.js 22.12 o superior** (o 20.19+). Vite 8 no funciona con versiones anteriores. Revisa con `node -v`.
- **npm** (viene con Node)

## 1. Clonar

El código está en la rama `claude/loving-ritchie-fl9w4h`:

```bash
git clone -b claude/loving-ritchie-fl9w4h https://github.com/DevOjeda016/web-services-projects-react.git
cd web-services-projects-react
```

## 2. Instalar dependencias

**Linux / macOS** (o Git Bash / WSL en Windows):

```bash
./instalar-dependencias.sh
```

**Windows (CMD, o PowerShell 7+)**, sin bash. Ejecuta cada línea desde la raíz del repo:

```bat
cd zodiaco\Backend && npm install && cd ..\Frontend && npm install && cd ..\..
cd tienda-refrescos\Backend && npm install && cd ..\Frontend && npm install && cd ..\..
cd lista-tareas\Backend && npm install && cd ..\Frontend && npm install && cd ..\..
cd portal-escolar\Backend && npm install && cd ..\Frontend && npm install && cd ..\..
cd lattice-systems-web-frontend && npm install && cd Backend && npm install && cd ..\..
```

## 3. Levantar los 5 proyectos

**Linux / macOS:**

```bash
./iniciar-proyectos.sh
```

**Windows:** doble clic en `iniciar-proyectos.bat` (o `iniciar-proyectos.bat` en CMD).

El script compila los frontends que todavía no tengan carpeta `dist`, levanta los 5 backends y abre cada proyecto en el navegador:

- http://localhost:3000 — Zodiaco
- http://localhost:3001 — Tienda de Refrescos
- http://localhost:3002 — Lista de Tareas
- http://localhost:3003 — Portal Escolar
- http://localhost:3004 — Lattice Systems

**Detener:** `./detener-proyectos.sh` (Linux/macOS). En Windows, cierra las ventanas de consola que se abrieron.

> En Linux/macOS el script usa `lsof` para registrar los procesos; si no lo tienes instalado, instálalo (`sudo apt install lsof`) o levanta cada backend a mano (ver abajo).

## Levantar un solo proyecto

Cada proyecto se sirve desde su backend, que entrega el build de React y la API. Ejemplo con Zodiaco:

```bash
cd zodiaco/Frontend
npm install
npm run build        # genera Frontend/dist

cd ../Backend
npm install
npm start            # http://localhost:3000
```

Para Lattice Systems el build está en la raíz del proyecto:

```bash
cd lattice-systems-web-frontend
npm install
npm run build        # genera dist/
cd Backend && npm install && npm start   # http://localhost:3004
```

## Desarrollo con recarga en caliente

Usa dos terminales: el backend (API) y el servidor de desarrollo de Vite, que redirige `/api` al backend.

```bash
# Terminal 1
cd zodiaco/Backend && npm start

# Terminal 2
cd zodiaco/Frontend && npm run dev     # http://localhost:5173
```

Puertos de desarrollo de Vite: Zodiaco 5173, Tienda 5174, Tareas 5175, Portal 5176, Lattice 4200.

Si cambias un frontend y quieres verlo en el puerto del backend, vuelve a ejecutar `npm run build` en esa carpeta (o borra su `dist` para que `iniciar-proyectos` lo recompile).

## Solución de problemas

- **`EADDRINUSE` / puerto en uso:** ya hay algo escuchando en ese puerto (por ejemplo, una ejecución anterior). Ejecuta `./detener-proyectos.sh` o cierra el proceso que lo usa.
- **Error de Vite o "Unsupported engine":** tu versión de Node es muy vieja. Actualiza a Node 22.12+.
- **Pantalla en blanco o `Cannot GET /`:** falta compilar el frontend. Ejecuta `npm run build` en la carpeta del frontend correspondiente.
- **`Permission denied` al correr los `.sh`:** `chmod +x *.sh`.
- **Los cambios no aparecen:** recuerda que el backend sirve el build; recompila con `npm run build` o usa el modo desarrollo.

## Datos y archivos locales

- `lista-tareas/Backend/data/tareas.json` y `tienda-refrescos/Backend/data/pedidos.json` se escriben en disco cuando usas la app (agregar tareas, confirmar pedidos).
- `lattice-systems-web-frontend/Backend/data/mensajes.json` se crea al enviar el formulario de contacto y **no se versiona** (contiene datos de visitantes).
- Algunas funciones usan `localStorage` del navegador (cachés y colas de sincronización cuando no hay conexión).

## Qué cambió respecto a la versión original

- Frontends vanilla JS → React; Lattice: Angular → React.
- Se eliminó todo lo del Service Worker (`sw.js`, su registro, `ngsw`, `AppUpdateService`). El modo offline que no depende del SW se conserva: aviso «Modo offline», cachés en `localStorage` y colas de sincronización de tareas, pedidos y mensajes de contacto.
- Los backends y los datos no cambiaron, salvo que ahora sirven el build de React.
