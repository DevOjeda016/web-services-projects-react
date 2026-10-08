import { useEffect, useState } from 'react';

/** true mientras el navegador tenga conexión; se actualiza con los eventos online/offline. */
export function useOnline(): boolean {
  const [online, setOnline] = useState(typeof navigator === 'undefined' || navigator.onLine);

  useEffect(() => {
    const alConectar = () => setOnline(true);
    const alDesconectar = () => setOnline(false);
    window.addEventListener('online', alConectar);
    window.addEventListener('offline', alDesconectar);
    return () => {
      window.removeEventListener('online', alConectar);
      window.removeEventListener('offline', alDesconectar);
    };
  }, []);

  return online;
}
