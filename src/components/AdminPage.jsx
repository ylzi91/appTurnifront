import { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { addUserAction } from "../redux/actions";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";
import Caricamento from "./Caricamento";
import NavAdmin from "./NavAdmin";

const CreazioneTurni = lazy(() => import("./CreazioneTurni"));
const RegistraUtente = lazy(() => import("./RegistraUtente"));
const ProfilePage = lazy(() => import("./ProfilePage"));
const GestisciFerie = lazy(() => import("./GestisciFerie"));
const GestisciCambi = lazy(() => import("./GestisciCambi"));
const GestisciUtenti = lazy(() => import("./GestisciUtenti"));

export default function AdminPage() {
  const dispatch = useDispatch();
  const api = useApi();
  const { notifica } = useNotifiche();

  useEffect(() => {
    // Con il token scaduto useApi avvisa e riporta al login
    api("/utenti/me")
      .then((utente) => dispatch(addUserAction(utente)))
      .catch((error) => {
        if (error.status !== 401) notifica(error.message);
      });
  }, []);

  return (
    <>
      <NavAdmin />
      <Suspense fallback={<Caricamento />}>
        <Routes>
          <Route path="creazione_turni" element={<CreazioneTurni />} />
          <Route path="registra_utente" element={<RegistraUtente />} />
          <Route path="me" element={<ProfilePage />} />
          <Route path="gestisci_ferie" element={<GestisciFerie />} />
          <Route path="gestisci_cambi" element={<GestisciCambi />} />
          <Route path="gestisci_utenti" element={<GestisciUtenti />} />
        </Routes>
      </Suspense>
    </>
  );
}
