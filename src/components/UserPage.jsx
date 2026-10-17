import { useDispatch, useSelector } from "react-redux";
import { addUserAction, removeRoleAction, removeTokenAction } from "../redux/actions";
import NavUser from "./NavUser";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import ProfilePage from "./ProfilePage";
import TurniUtente from "./TurniUtente";
import RichiediFerie from "./RichediFerie";
import CambioTurno from "./CambioTurno";
import VediCambi from "./VediCambi";

export default function UserPage() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cambiInIngresso, setCambiInIngresso] = useState([]);
  const [errorUser, setErrorUser] = useState(null);

  const getUtente = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL}/utenti/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const content = await response.json();
        dispatch(addUserAction(content));
      } else {
        const content = await response.json();
        throw new Error(content.message);
      }
    } catch (error) {
      console.log("Errore nell'utente", error.message);
      setErrorUser(error.message);
    }
  };

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

  useEffect(() => {
    getUtente();
    cambiIngresso();
  }, []);
  return (
    <>
      {errorUser === "Problemi con il token, rifare il login" ? (
        <p className=" bg-white w-50 mx-auto p-4 text-center mt-2 rounded-2">
          {" "}
          La sessione è scaduta torna alla pagina di{" "}
          <Button
            onClick={() => {
              dispatch(removeTokenAction());
              dispatch(removeRoleAction());
              navigate("/");
            }}
          >
            Login
          </Button>
        </p>
      ) : auth.role !== "USER" ? (
        <h1>NON puoi stare sulla pagina</h1>
      ) : (
        <>
          <NavUser cambIng={cambiInIngresso.length} />
          <Routes>
            <Route path="me" element={<ProfilePage />} />
            <Route path="turni" element={<TurniUtente />} />
            <Route path="ferie" element={<RichiediFerie />} />
            <Route path="cambioturno/:email" element={<CambioTurno />} />
            <Route path="vedi_cambi" element={<VediCambi />} />
          </Routes>
        </>
      )}
    </>
  );
}
