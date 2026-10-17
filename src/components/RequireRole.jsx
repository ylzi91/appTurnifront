import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Senza login si torna al login; con un ruolo non ammesso si va alla propria home
export default function RequireRole({ ruoli, children }) {
  const { token, role } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/" replace />;
  if (!ruoli.includes(role))
    return (
      <Navigate
        to={role === "USER" ? "/user_page/me" : "/admin_page/creazione_turni"}
        replace
      />
    );
  return children;
}
