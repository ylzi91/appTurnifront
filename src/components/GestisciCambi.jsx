import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import Aldoo from "../assets/img/Aldooo.png"

function GestisciCambi() {
  const token = useSelector((state) => state.auth.token);
  const [cambiTurni, setCambiTurni] = useState([]);
  const [spinnerTurni, setSpinnerTurni] = useState(false)

  const tuttiCambi = async () => {
    try {
      setSpinnerTurni(true)
      const response = await fetch(`${import.meta.env.VITE_URL}/cambioturno`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const content = await response.json();
        if (!content.message) setCambiTurni(content);
        else setCambiTurni(content);
      }
    } catch (error) {}
    finally {
      setSpinnerTurni(false)
    }
  };

  const patchCambio = async (idCambio, statoRichiesta) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/cambioturno/${idCambio}`,
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
        tuttiCambi()
      }
    } catch (error) {
      console.log("Errore nella get", error.message);
    }
  };
  useEffect(() => {
    tuttiCambi();
  }, []);

  return (
    <>
      <Container fluid>
        <Row>
           
            {spinnerTurni ? <Spinner style={{width: 50, height: 50}} className=" border-0" animation="border" size="sm"><img className=" rounded-circle" src={Aldoo} width={50} height={50} alt="" /></Spinner> : cambiTurni.length === 0 && <span>Non ci sono cambi</span>}
            {cambiTurni.length >= 0 &&
              cambiTurni?.sort((cambio1, cambio2) => cambio2.id - cambio1.id)?.map((cambio) => {
                return ( 
                <Col md={4}>
                  <Card
                    key={cambio.id}
                    className=" mt-2 text-center shadow position-relative pt-4"
                    body
                  >
                    <div className=" bg-body-secondary p-2 rounded-2 mb-2 mx-auto">
                      <p>
                        Richiedente cambio,{" "}
                        {cambio.utenteRichiedenteTurno.utente.nome}{" "}
                        {cambio.utenteRichiedenteTurno.utente.cognome} il{" "}
                        {cambio.utenteRichiedenteTurno.giornoTurno}
                      </p>
                      <p className=" mb-0">
                        Turno: {cambio.utenteRichiedenteTurno.turno.nomeTurno}
                      </p>
                    </div>
                    <div className=" bg-dark-subtle p-2 rounded-2 mb-2 mx-autov fs-6">
                      <p>
                        Concedente cambio,{" "}
                        {cambio.utenteRispondenteTurno.utente.nome}{" "}
                        {cambio.utenteRispondenteTurno.utente.cognome}:{" "}
                        {cambio.utenteRispondenteTurno.giornoTurno}
                      </p>
                      <p className=" mb-0">
                        Turno: {cambio.utenteRispondenteTurno.turno.nomeTurno}
                      </p>
                    </div>
                    {cambio.statoRichiesta === "APPROVATA_RISPONDENTE" && (
                      <>
                        <Button
                          variant="success"
                          onClick={(e) => {
                            e.preventDefault();
                            patchCambio(cambio.id, "APPROVATO_CAPO")
                          }}
                          className=" me-2 text-white"
                        >
                          Accetta
                        </Button>
                        <Button variant="danger" className=" text-white" onClick={(e) => {
                            patchCambio(cambio.id, "RIFIUTATO_CAPO")
                          }}>
                          Rifiuta
                        </Button>
                      </>
                    )}
                    {cambio.statoRichiesta === "RIFIUTATO_CAPO" && <p>Hai rifiutato questo cambio</p>}
                    {cambio.statoRichiesta === "APPROVATO_CAPO" && <p>Hai accettato questo cambio</p>}
                  </Card>
                   </Col>
                );
              })}
         
        </Row>
      </Container>
    </>
  );
}

export default GestisciCambi;
