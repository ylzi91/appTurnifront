import { use } from "react";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { TiDeleteOutline } from "react-icons/ti";
import { useSelector } from "react-redux";

function VediCambi() {
  const currentUtente = useSelector((state) => state.user.utente);
  const token = useSelector((state) => state.auth.token);
  const [cambiTurni, setCambiTurni] = useState([]);
  const [stato, setStato] = useState("uscita");
  const [buttonSwitch, setButtonSwitch] = useState(["In uscita", "In entrata"]);
  const [selBtn, setSelBtn] = useState("In uscita");

  const mieiCambi = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/cambioturno/me/${stato}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const content = await response.json();
        if (content.message === null) setCambiTurni(content);
        else setCambiTurni(content);
      }
    } catch (error) {}
  };
  const handleStato = () => {
    if (stato === "uscita") setStato("ingresso");
    else if (stato === "ingresso") setStato("uscita");
  };

  const patchCambio = async (idCambio, statoRichiesta) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/cambioturno/me/ingresso/${idCambio}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "statoRichiesta": statoRichiesta
          }),
        }
      );
      if (!response.ok) {
        const content = await response.json();
        throw new Error(content.message);
      } else {
        mieiCambi()
      }
    } catch (error) {
      console.log("Errore nella get", error.message);
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
                  value={btn}
                  onClick={(e) => {
                    setSelBtn(e.target.value);
                    handleStato();
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
              cambiTurni?.sort((cambio1, cambio2) => cambio2.id - cambio1.id)?.map((cambio) => {
                return (
                  <Card
                    key={cambio.id}
                    className=" my-2 text-center shadow position-relative pt-4"
                    body
                  >
                    <div className=" bg-body-secondary p-2 rounded-2 mb-2 mx-auto">
                      <p>
                        Richiedente cambio <span className=" d-block bg-info p-2 rounded-5 text-white">{cambio.utenteRichiedenteTurno.utente.nome} {cambio.utenteRichiedenteTurno.utente.cognome}</span>  il{" "}
                        <span className=" d-block bg-info text-white p-2 rounded-5">{cambio.utenteRichiedenteTurno.giornoTurno}</span>
                  
                        <span className=" d-block bg-info rounded-5 text-white mt-2 p-2">Turno {cambio.utenteRichiedenteTurno.turno.nomeTurno}</span>
                      </p>
                    </div>
                    <div className=" bg-dark-subtle p-2 rounded-2 mb-2 mx-autov fs-6">
                      <p>
                        Concedente cambio
                        <span className=" d-block bg-info p-2 rounded-5 text-white">{cambio.utenteRispondenteTurno.utente.nome}{" "}
                        {cambio.utenteRispondenteTurno.utente.cognome}</span> il {" "}
                        <span className=" d-block bg-info text-white p-2 rounded-5">{cambio.utenteRispondenteTurno.giornoTurno}</span>
                      
                        <span className=" d-block bg-info rounded-5 text-white mt-2 p-2">Turno {cambio.utenteRispondenteTurno.turno.nomeTurno}</span>
                      </p>
                    </div>
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
