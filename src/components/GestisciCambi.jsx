import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import CambioInfo from "./CambioInfo";
import Aldoo from "../assets/img/Aldooo.png"

function GestisciCambi() {
  const token = useSelector((state) => state.auth.token);
  const [cambiTurni, setCambiTurni] = useState([]);
  const [spinnerTurni, setSpinnerTurni] = useState(false)
  const [erroreCambio, setErroreCambio] = useState(null)

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
      setErroreCambio(null)
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
      setErroreCambio(error.message)
    }
  };
  useEffect(() => {
    tuttiCambi();
  }, []);

  return (
    <>
      <Container fluid>
        {erroreCambio && (
          <Alert variant="danger" className=" mt-2" dismissible onClose={() => setErroreCambio(null)}>
            {erroreCambio}
          </Alert>
        )}
        <Row>
           
            {spinnerTurni ? <Spinner style={{width: 50, height: 50}} className=" border-0" animation="border" size="sm"><img className=" rounded-circle" src={Aldoo} width={50} height={50} alt="" /></Spinner> : cambiTurni.length === 0 && <span>Non ci sono cambi</span>}
            {cambiTurni.length >= 0 &&
              [...cambiTurni].sort((cambio1, cambio2) => cambio2.id - cambio1.id).map((cambio) => {
                return ( 
                <Col md={4} key={cambio.id}>
                  <Card
                    className=" mt-2 text-center shadow position-relative pt-4"
                    body
                  >
                    <CambioInfo cambio={cambio} />
                    {cambio.statoRichiesta === "APPROVATA_RISPONDENTE" && (
                      <>
                        {cambio.avvisi?.length > 0 && (
                          <Alert variant="warning" className=" py-2 fs-6">
                            <strong>Attenzione:</strong>
                            {cambio.avvisi.map((avviso) => (
                              <div key={avviso}>{avviso}</div>
                            ))}
                          </Alert>
                        )}
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
