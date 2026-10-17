import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";
import CambioInfo from "./CambioInfo";
import Aldoo from "../assets/img/Aldooo.png"

function GestisciCambi() {
  const api = useApi();
  const { notifica } = useNotifiche();
  const [cambiTurni, setCambiTurni] = useState([]);
  const [spinnerTurni, setSpinnerTurni] = useState(false)
  const [erroreCambio, setErroreCambio] = useState(null)

  const tuttiCambi = async () => {
    try {
      setSpinnerTurni(true)
      const content = await api("/cambioturno")
      setCambiTurni(Array.isArray(content) ? content : [])
    } catch (error) {
      notifica(error.message)
    } finally {
      setSpinnerTurni(false)
    }
  };

  const patchCambio = async (idCambio, statoRichiesta) => {
    try {
      setErroreCambio(null)
      await api(`/cambioturno/${idCambio}`, { method: "PATCH", body: { statoRichiesta } })
      tuttiCambi()
    } catch (error) {
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
