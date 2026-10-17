import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const NotificheContext = createContext({ notifica: () => {} });

export const useNotifiche = () => useContext(NotificheContext);

// Messaggi a comparsa (errori, conferme) visibili in qualunque pagina
export function NotificheProvider({ children }) {
  const [lista, setLista] = useState([]);

  const notifica = useCallback((messaggio, variante = "danger") => {
    if (!messaggio) return; // errori già gestiti altrove (es. sessione scaduta)
    const id = Date.now() + Math.random();
    setLista((corrente) =>
      corrente.some((n) => n.messaggio === messaggio) // più richieste che falliscono insieme: un solo avviso
        ? corrente
        : [...corrente, { id, messaggio, variante }]
    );
  }, []);

  const chiudi = (id) => setLista((corrente) => corrente.filter((n) => n.id !== id));
  const valore = useMemo(() => ({ notifica }), [notifica]);

  return (
    <NotificheContext.Provider value={valore}>
      {children}
      <ToastContainer position="top-end" className=" p-3 position-fixed" style={{ zIndex: 2000 }}>
        {lista.map((n) => (
          <Toast key={n.id} bg={n.variante} show autohide delay={5000} onClose={() => chiudi(n.id)}>
            <Toast.Body className={n.variante === "warning" ? "" : "text-white"}>{n.messaggio}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </NotificheContext.Provider>
  );
}
