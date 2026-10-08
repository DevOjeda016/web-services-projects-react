#!/usr/bin/env bash
# Instala las dependencias (npm install) de los 5 proyectos (backends y frontends de React).
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

instalar() {
  local nombre="$1"
  local ruta="$2"
  echo "==> Instalando $nombre ($ruta)"
  (cd "$ruta" && npm install)
  echo
}

instalar "Zodiaco (Backend)" "$ROOT/zodiaco/Backend"
instalar "Zodiaco (Frontend)" "$ROOT/zodiaco/Frontend"
instalar "Tienda de Refrescos (Backend)" "$ROOT/tienda-refrescos/Backend"
instalar "Tienda de Refrescos (Frontend)" "$ROOT/tienda-refrescos/Frontend"
instalar "Lista de Tareas (Backend)" "$ROOT/lista-tareas/Backend"
instalar "Lista de Tareas (Frontend)" "$ROOT/lista-tareas/Frontend"
instalar "Portal Escolar (Backend)" "$ROOT/portal-escolar/Backend"
instalar "Portal Escolar (Frontend)" "$ROOT/portal-escolar/Frontend"
instalar "Lattice Systems (Frontend)" "$ROOT/lattice-systems-web-frontend"
instalar "Lattice Systems (Backend)" "$ROOT/lattice-systems-web-frontend/Backend"

echo "Listo. Dependencias instaladas en los 5 proyectos."
