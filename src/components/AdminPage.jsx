import { useDispatch, useSelector } from "react-redux";
import CreazioneTurni from "./CreazioneTurni";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavAdmin from "./NavAdmin";
import RegistraUtente from "./RegistraUtente";
import { addUserAction } from "../redux/actions";
import { useEffect } from "react";
import ProfilePage from "./ProfilePage";
import GestisciFerie from "./GestisciFerie";

export default function AdminPage() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  const getUtente = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_URL}/utenti/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        });
        const content = await response.json();
        dispatch(addUserAction(content));
      } catch (error) {
        console.log("Errore nella fetch utente");
      }
  }

  useEffect(()=> {
    getUtente()
  },[])


  return (
    <>
      {auth.role !== "ADMIN" ? (
        <h1>NON puoi stare sulla pagina</h1>
      ) : (
        <>
             <NavAdmin/>
          <Routes>
           
            <Route path="creazione_turni" element={<CreazioneTurni />} />
            <Route path="registra_utente" element={<RegistraUtente />} />
            <Route path="me" element={<ProfilePage/>}/>
            <Route path="gestisci_ferie" element={<GestisciFerie/>}/>
          </Routes>
        </>
      )}
    </>
  );
}
