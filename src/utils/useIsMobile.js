import { useEffect, useState } from "react";

// true sotto i 768px (breakpoint "md" di Bootstrap)
export default function useIsMobile() {
  const query = "(max-width: 767.98px)";
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const aggiorna = (e) => setIsMobile(e.matches);
    mql.addEventListener("change", aggiorna);
    return () => mql.removeEventListener("change", aggiorna);
  }, []);
  return isMobile;
}
