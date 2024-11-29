import { useDispatch, useSelector } from "react-redux";
import { addUserAction } from "../redux/actions";
import NavUser from "./NavUser";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import TurniUtente from "./TurniUtente";
import RichiediFerie from "./RichediFerie";


export default function UserPage() {

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
    return(
        <>
            {auth.role !== "USER" ? (
        <h1>NON puoi stare sulla pagina</h1>
      ) : (
        <>
             <NavUser/>
          <Routes>
            <Route path="me" element={<ProfilePage/>}/>
            <Route path="turni" element={<TurniUtente/>}/>
            <Route path="ferie" element={<RichiediFerie/>}/>
          </Routes>
        </>
      )}
    </>
    
    )
} 