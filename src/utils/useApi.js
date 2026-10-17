import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useNotifiche } from "../components/Notifiche";
import { ApiError, apiFetch } from "./api";
import useLogout from "./useLogout";

// Come apiFetch ma con il token dell'utente; su 401 (token scaduto) avvisa ed esce
export default function useApi() {
  const token = useSelector((state) => state.auth.token);
  const logout = useLogout();
  const { notifica } = useNotifiche();

  return useCallback(
    async (path, opzioni) => {
      try {
        return await apiFetch(path, { token, ...opzioni });
      } catch (errore) {
        if (errore.status === 401 && token) {
          notifica("Sessione scaduta, accedi di nuovo", "warning");
          logout();
          // Messaggio vuoto: i chiamanti non mostrano altri avvisi per lo stesso problema
          throw new ApiError("", 401);
        }
        throw errore;
      }
    },
    [token, logout, notifica]
  );
}
