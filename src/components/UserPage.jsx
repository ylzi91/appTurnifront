import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { addUserAction } from "../redux/actions";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";
import Caricamento from "./Caricamento";
import NavUser from "./NavUser";

const ProfilePage = lazy(() => import("./ProfilePage"));
const TurniUtente = lazy(() => import("./TurniUtente"));
const RichiediFerie = lazy(() => import("./RichediFerie"));
const CambioTurno = lazy(() => import("./CambioTurno"));
const VediCambi = lazy(() => import("./VediCambi"));

export default function UserPage() {
  const dispatch = useDispatch();
  const api = useApi();
  const { notifica } = useNotifiche();
  const [cambiInIngresso, setCambiInIngresso] = useState([]);

  useEffect(() => {
    // Con il token scaduto useApi avvisa e riporta al login
    api("/utenti/me")
      .then((utente) => dispatch(addUserAction(utente)))
      .catch((error) => {
        if (error.status !== 401) notifica(error.message);
      });
    api("/cambioturno/me/ingresso/in_corso")
      .then((cambi) => setCambiInIngresso(Array.isArray(cambi) ? cambi : []))
      .catch(() => {}); // il contatore sulla navbar è accessorio
  }, []);

  return (
    <>
      <NavUser cambIng={cambiInIngresso.length} />
      <Suspense fallback={<Caricamento />}>
        <Routes>
          <Route path="me" element={<ProfilePage />} />
          <Route path="turni" element={<TurniUtente />} />
          <Route path="ferie" element={<RichiediFerie />} />
          <Route path="cambioturno/:email" element={<CambioTurno />} />
          <Route path="vedi_cambi" element={<VediCambi />} />
        </Routes>
      </Suspense>
    </>
  );
}
