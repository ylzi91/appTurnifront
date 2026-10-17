import { useDispatch, useSelector } from "react-redux";
import CreazioneTurni from "./CreazioneTurni";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";
import NavAdmin from "./NavAdmin";
import RegistraUtente from "./RegistraUtente";
import { addUserAction, removeRoleAction, removeTokenAction } from "../redux/actions";
import { useEffect, useState } from "react";
import ProfilePage from "./ProfilePage";
import GestisciFerie from "./GestisciFerie";
import GestisciCambi from "./GestisciCambi";
import GestisciUtenti from "./GestisciUtenti";
import { Button } from "react-bootstrap";

export default function AdminPage() {
  const auth = useSelector((state) => state.auth);
  const [errorMe, setErrorMe] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getUtente = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_URL}/utenti/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        });
        if(response.ok){
          const content = await response.json();
          dispatch(addUserAction(content));

        }
        else {
          const content = await response.json()
          throw new Error(content.message)
        }
      } catch (error){
        console.log("Errore nell'utente", error.message);
        setErrorMe(error.message)
      }
  }

  useEffect(()=> {
    getUtente()
  },[])


  return (
    <>
      {errorMe === "Problemi con il token, rifare il login" ? (<p className=" bg-white w-50 mx-auto p-4 text-center mt-2 rounded-2"> La sessione è scaduta torna alla pagina di <Button onClick={() => {
        dispatch(removeTokenAction())
        dispatch(removeRoleAction())
        navigate('/')
      }}>Login</Button></p>) : (auth.role === "USER") ? (
        <h1>NON puoi stare sulla pagina</h1>
      ) : (
        <>
             <NavAdmin/>
          <Routes>
           
            <Route path="creazione_turni" element={<CreazioneTurni />} />
            <Route path="registra_utente" element={<RegistraUtente />} />
            <Route path="me" element={<ProfilePage/>}/>
            <Route path="gestisci_ferie" element={<GestisciFerie/>}/>
            <Route path="gestisci_cambi" element={<GestisciCambi/>}/>
            <Route path="gestisci_utenti" element={<GestisciUtenti/>}/>
          </Routes>
        </>
      )}
    </>
  );
}
