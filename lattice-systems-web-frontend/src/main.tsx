import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { iniciarSincronizacionContacto } from './shared/contactMessages';
import './styles.css';

// Reintenta enviar los mensajes de contacto que quedaron en cola sin conexión.
iniciarSincronizacionContacto();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
