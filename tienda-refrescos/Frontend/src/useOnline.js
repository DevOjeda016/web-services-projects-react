import { useEffect, useState } from "react";

// Devuelve true si el navegador tiene conexion; se actualiza con los eventos online/offline.
export function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const alConectar = () => setOnline(true);
    const alDesconectar = () => setOnline(false);
    window.addEventListener("online", alConectar);
    window.addEventListener("offline", alDesconectar);
    return () => {
      window.removeEventListener("online", alConectar);
      window.removeEventListener("offline", alDesconectar);
    };
  }, []);

  return online;
}
