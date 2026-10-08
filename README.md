# Web Services Projects (React)

Los 5 proyectos del repositorio `webservices-projets`, con el frontend reescrito en **React** (Vite) y **sin Service Worker**. Todo lo demás (backends Express, datos, estilos, lógica y puertos) se mantiene igual.

| Proyecto | Puerto | Frontend |
|---|---|---|
| `zodiaco` | 3000 | React + Vite (JS) |
| `tienda-refrescos` | 3001 | React + Vite (JS) |
| `lista-tareas` | 3002 | React + Vite (JS) |
| `portal-escolar` | 3003 | React + Vite (JS) |
| `lattice-systems-web-frontend` | 3004 | React + Vite + TypeScript + Tailwind v4 |

## Estructura

Cada proyecto tiene `Backend/` (Express, sin cambios salvo que ahora sirve el build de React) y un frontend de React:

- Proyectos pequeños: `Frontend/` es un proyecto Vite; el build queda en `Frontend/dist`, que el backend sirve como estático.
- Lattice: el proyecto Vite está en la raíz de `lattice-systems-web-frontend/`; el build queda en `dist/`.

## Uso

```bash
./instalar-dependencias.sh   # npm install en backends y frontends
./iniciar-proyectos.sh       # compila los frontends que falten, levanta los 5 backends y abre el navegador
./detener-proyectos.sh
```

En Windows: `iniciar-proyectos.bat`.

Desarrollo con recarga en caliente (ejemplo con Zodiaco): en una terminal `cd zodiaco/Backend && npm start`, en otra `cd zodiaco/Frontend && npm run dev` (Vite redirige `/api` al backend).

## Qué cambió respecto a la versión original

- Frontends vanilla JS → componentes React; Lattice: Angular → React.
- Se eliminó todo lo del Service Worker (`sw.js`, registro, `ngsw`, `AppUpdateService`). El modo offline que no depende del SW se conserva: badge «Modo offline», cachés en `localStorage` y colas de sincronización (tareas, pedidos y mensajes de contacto).
