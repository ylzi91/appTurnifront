import { useDispatch, useSelector } from "react-redux";
import { addUserAction } from "../redux/actions";
import NavUser from "./NavUser";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import TurniUtente from "./TurniUtente";
import RichiediFerie from "./RichediFerie";
import CambioTurno from "./CambioTurno";
import VediCambi from "./VediCambi";


export default function UserPage() {

    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const [cambiInIngresso, setCambiInIngresso] = useState([])
  
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

    const cambiIngresso = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}/cambioturno/me/ingresso/in_corso`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${auth.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const content = await response.json();
          if (content.message === null) setCambiInIngresso(content);
          else setCambiInIngresso(content);
        }
      } catch (error) {}
    };
  
    useEffect(()=> {
      getUtente()
      cambiIngresso()
    },[])
    return(
        <>
            {auth.role !== "USER" ? (
        <h1>NON puoi stare sulla pagina</h1>
      ) : (
        <>
             <NavUser cambIng={cambiInIngresso.length}/>
          <Routes>
            <Route path="me" element={<ProfilePage/>}/>
            <Route path="turni" element={<TurniUtente/>}/>
            <Route path="ferie" element={<RichiediFerie/>}/>
            <Route path="cambioturno/:email" element={<CambioTurno/>}/>
            <Route path="vedi_cambi" element={<VediCambi/>}/>
          </Routes>
        </>
      )}
    </>
    
    )
} 