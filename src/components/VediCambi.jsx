import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { useSelector } from "react-redux";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";
import CambioInfo from "./CambioInfo";

function VediCambi() {
  const currentUtente = useSelector((state) => state.user.utente);
  const api = useApi();
  const { notifica } = useNotifiche();
  const [cambiTurni, setCambiTurni] = useState([]);
  const [stato, setStato] = useState("uscita");
  const buttonSwitch = ["In uscita", "In entrata"];
  const [selBtn, setSelBtn] = useState("In uscita");

  const mieiCambi = async () => {
    try {
      const content = await api(`/cambioturno/me/${stato}`);
      setCambiTurni(content);
    } catch (error) {
      notifica(error.message);
    }
  };

  const patchCambio = async (idCambio, statoRichiesta) => {
    try {
      await api(`/cambioturno/me/ingresso/${idCambio}`, {
        method: "PATCH",
        body: { statoRichiesta },
      });
      mieiCambi();
    } catch (error) {
      notifica(error.message);
    }
  };

  useEffect(() => {
    mieiCambi();
  }, [stato]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            {buttonSwitch.map((btn) => {
              return (
                <Button
                  key={btn}
                  value={btn}
                  onClick={(e) => {
                    setSelBtn(btn);
                    setStato(btn === "In entrata" ? "ingresso" : "uscita");
                  }}
                  variant={selBtn === btn ? "primary" : "outline-primary"}
                  className=" me-2 mb-2"
                >
                  {btn}
                </Button>
              );
            })}
          </Col>
        </Row>
        <Row>
          <Col>
            {cambiTurni.message !== undefined && (
              <span className=" bg-white p-1 rounded-2 text-info fw-bold">Non ci sono cambi in {stato}</span>
            )}
            {cambiTurni.length >= 0 &&
              Array.isArray(cambiTurni) && [...cambiTurni].sort((cambio1, cambio2) => cambio2.id - cambio1.id).map((cambio) => {
                return (
                  <Card
                    key={cambio.id}
                    className=" my-2 text-center shadow position-relative pt-4"
                    body
                  >
                    <CambioInfo cambio={cambio} />
                    <p>Stato: {(cambio.statoRichiesta === "RIFIUTATA_RISPONDENTE" && cambio.utenteRichiedenteTurno.utente.email === currentUtente.email) ? 
                    "La richiesta è stata rifutata dal collega" :  
                    (cambio.statoRichiesta === "RIFIUTATA_RISPONDENTE" && cambio.utenteRispondenteTurno.utente.email === currentUtente.email) ? 
                    "Hai rifiutato la richista" : 
                    (cambio.statoRichiesta === "APPROVATA_RISPONDENTE"  && cambio.utenteRispondenteTurno.utente.email === currentUtente.email ) ? 
                    "Hai approvato la richiesta" : 
                    cambio.statoRichiesta === "APPROVATA_RISPONDENTE"  && cambio.utenteRichiedenteTurno.utente.email === currentUtente.email ? 
                    "Il collega ha accettato la richiesta" : 
                    cambio.statoRichiesta === "IN_CORSO" ? "Richiesta in corso" : 
                    cambio.statoRichiesta === "APPROVATO_CAPO" ? "Il capo ha approvato" : "Il capo non ha approvato"  
                    } </p>
                    {(cambio.statoRichiesta === "IN_CORSO" && stato === "ingresso") && (
                        <>
                        <p
                          className=" position-absolute p-0 top-0 end-0 me-3 mt-2 pointer"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <TiDeleteOutline size={30} />
                        </p>
                        <Button variant="success" onClick={(e) => {
                            e.preventDefault()
                            patchCambio(cambio.id, "APPROVATA_RISPONDENTE")
                        }} className=" me-2 text-white">Accetta</Button>
                        <Button variant="danger" onClick={(e) => {
                            e.preventDefault()
                            patchCambio(cambio.id, "RIFIUTATA_RISPONDENTE")
                        }}  className=" text-white">Rifiuta</Button>
                        </>
                    )}
                  </Card>
                );
              })}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default VediCambi;
