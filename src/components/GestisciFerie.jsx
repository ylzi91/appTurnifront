import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  ToggleButton,
} from "react-bootstrap";
import { useSelector } from "react-redux";

function GestisciFerie() {
  const [richiesteFerie, setRichiesteFerie] = useState([]);
  const [erroreFerie, setErroreFerie] = useState(null);
  const [pulsanteSave, setPulsanteSave] = useState({
    visible: false,
    ferieId: "",
  });
  const [pulsantiFiltro, setPulsantiFiltro] = useState([
    "Tutte",
    "Da approvare",
    "Approvate",
    "Rifiutate",
  ]);
  const [cliccatoPuls, setCliccatoPuls] = useState("Tutte");
  const [st, setSt] = useState("");
  const auth = useSelector((state) => state.auth);
  const [errore, setErrore] = useState("");
  const [arrayVuoto, setArrayVuoto] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getFerie = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/ferie?statoRichiesta=${st}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const content = await response.json();
        console.log("Errore nella risposta del server:", content);
        throw new Error(content);
      } else {
        const content = await response.json();
        if (content.message) setArrayVuoto(true);
        else {
          setRichiesteFerie(content);
          setArrayVuoto(false);
        }
      }
    } catch (error) {
      setErrore(error.message);
      console.log("Errore nella get", error.message);
    }
  };

  const patchFerie = async (idFerie, statoRichiesta) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/ferie/aod/${idFerie}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            statoRichiesta: statoRichiesta,
          }),
        }
      );
      if (!response.ok) {
        const content = await response.json();
        throw new Error(content.message);
      } else {
        handleShow();
      }
    } catch (error) {
      console.log("Errore nella get", error.message);
    }
  };

  const saveFerieTurni = async (ferieId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/utenteturno/${ferieId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const content = await response.json();
        console.log("Errore nella risposta del server:", content);
        throw new Error(content.message);
      } else {
        const content = await response.json();
        setErroreFerie({
          message: content.message,
          id: ferieId,
        });
      }
    } catch (error) {
      setErroreFerie({
        message: error.message,
        id: ferieId,
      });
      console.log("Errore nella saveTurniFerie", error.message);
    }
  };

  const handleFilter = (value) => {
    switch (value) {
      case "Tutte": {
        setSt("");
        break;
      }
      case "Da approvare": {
        setSt("IN_CORSO");
        break;
      }
      case "Approvate": {
        setSt("APPROVATO_CAPO");
        break;
      }
      case "Rifiutate": {
        setSt("RIFIUTATO_CAPO");
        break;
      }
    }
  };

  useEffect(() => {
    getFerie();
  }, [st]);

  return (
    <>
      <Container fluid>
        <Row className=" mb-2">
          <Col>
            {pulsantiFiltro.map((puls) => {
              return (
                <Button
                  value={puls}
                  onClick={(e) => {
                    setCliccatoPuls(e.target.value);
                    handleFilter(e.target.value);
                  }}
                  variant={
                    cliccatoPuls === puls ? "primary" : "outline-primary"
                  }
                  className=" me-2"
                >
                  {puls}
                </Button>
              );
            })}
          </Col>
        </Row>
        <Row className=" g-2">
          {arrayVuoto ? (
            <p>Non ci sono ferie</p>
          ) : (
            richiesteFerie?.map((ferie) => {
              const parts = ferie.dataInizio.split("-");
              const formattedDateIn = `${parts[2]}/${parts[1]}/${parts[0]}`;
              const partsFin = ferie.dataFine.split("-");
              const formattedDateFin = `${partsFin[2]}/${partsFin[1]}/${partsFin[0]}`;
              //vediFerieTurni(ferie.id)
              return (
                <Col lg={3} key={ferie.id}>
                  <Card>
                    <Card.Header>
                      <Card.Title>
                        {ferie.utente.nome} {ferie.utente.cognome}
                      </Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>Dal {formattedDateIn}</Card.Title>
                      <Card.Title>Al {formattedDateFin}</Card.Title>
                      <div className=" d-flex justify-content-evenly">
                        {ferie.statoRichiesta !== "IN_CORSO" ? (
                          (ferie.statoRichiesta === "APPROVATO_CAPO" || ferie.statoRichiesta === "RIFIUTATO_CAPO") && (
                            <>
                              <div>
                                <p>{ferie.statoRichiesta === "APPROVATO_CAPO" ? "Hai approvato la richiesta" : "Hai rifiutato la richiesta"}</p>
                                {ferie.statoRichiesta !== "RIFIUTATO_CAPO" && (
                                   <Button
                                  variant="success"
                                  className="text-white"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    saveFerieTurni(ferie.id);
                                  }}
                                >
                                  Aggiorna tabella turni
                                </Button>
                                )}
                               
                              </div>
                            </>
                          )
                        ) : (
                          <>
                            <Button
                              variant="success"
                              onClick={(e) => {
                                patchFerie(ferie.id, "APPROVATO_CAPO");
                      
                              }}
                              className=" w-50"
                            >
                              Concedi
                            </Button>
                            <Button
                              variant="danger"
                              className=" w-50"
                              onClick={(e) => {
                                e.preventDefault();
                                patchFerie(ferie.id, "RIFIUTATO_CAPO");
                              }}
                            >
                              Rifiuta
                            </Button>
                          </>
                        )}
                      </div>
                    </Card.Body>
                    {erroreFerie !== null && erroreFerie.id === ferie.id && (
                      <Alert
                        variant="info"
                        onClose={() => setErroreFerie(null)}
                        dismissible
                      >
                        {erroreFerie.message}
                      </Alert>
                    )}
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
      </Container>
    </>
  );
}

export default GestisciFerie;
