import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TiDeleteOutline } from "react-icons/ti";
import { formattaData } from "../utils/format";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";

export default function RichiediFerie() {
  const api = useApi();
  const { notifica } = useNotifiche();
  const [errore, setErrore] = useState("")
  const [spinner, setSpinner] = useState(false)
  const [dataInizio, setDataInizio] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [dataFine, setDataFine] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate());
  const [giorniFerie, setGiorniFerie] = useState([])


  const postFerie = async () => {
    try {
      setSpinner(true)
      await api("/ferie", { method: "POST", body: { dataInizio, dataFine } })
      getFerie()
    } catch (error) {
      setErrore(error.message)
      setTimeout(() => {setErrore("")}, 4000)
    } finally {
      setSpinner(false)
    }
  };

  const getFerie = async () => {
    try {
      const content = await api("/ferie/me")
      setGiorniFerie(Array.isArray(content) ? content : [])
    } catch (error) {
      notifica(error.message)
    }
  }

  const delFerie = async (idFerie) => {
    try {
      await api(`/ferie/${idFerie}`, { method: "DELETE" })
      getFerie()
    } catch (error) {
      notifica(error.message)
    }
  }

  useEffect(() => {
    getFerie()
  } ,[])

  return (
    <>
      <Container>
        <Row className=" justify-content-center">
          <Col lg={4}>
            <Card>
              <Card.Header>
                <Card.Title>Richiesta ferie</Card.Title>
              </Card.Header>
              <Card.Body>
                <div className=" d-flex flex-column text-center">
                  <Form.Label>Data inizio</Form.Label>
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={dataInizio}
                    minDate={tomorrow}
                    onChange={(date) =>
                      setDataInizio(date.toLocaleDateString("en-CA"))
                    }
                  />
                  <Form.Label>Data fine </Form.Label>
                  <DatePicker
                    dateFormat={"dd/MM/yyyy"}
                    selected={dataFine}
                    minDate={tomorrow}
                    onChange={(date) =>
                      setDataFine(date.toLocaleDateString("en-CA"))
                    }
                  />
                  <Button className=" mt-2" onClick={postFerie}>{!spinner ? "Invia richiesta" : <Spinner size="sm" animation="border"/>} </Button>
                  {errore !== "" && <p className=" text-danger">{errore}</p>}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className=" justify-content-center">
          <Col lg={4}>
          {giorniFerie.length > 0 ? giorniFerie.map((gf)=> {
            return (
              <Card key={gf.id} className=" my-2 shadow position-relative"  body>
                <p className=" mb-1">Dal <strong>{formattaData(gf.dataInizio)}</strong> al <strong>{formattaData(gf.dataFine)}</strong></p>
                <Badge bg={gf.statoRichiesta === 'APPROVATO_CAPO' ? "success" : gf.statoRichiesta === 'IN_CORSO' ? "warning" : "danger"} className=" align-self-start">
                  {gf.statoRichiesta === 'APPROVATO_CAPO' ? "Approvate" : gf.statoRichiesta === 'IN_CORSO' ? "In corso" : "Rifiutate"}
                </Badge>
                {gf.statoRichiesta === 'IN_CORSO' && <p title="Annulla la richiesta" role="button" className=" position-absolute p-0 top-0 end-0 me-3 mt-2 pointer" onClick={(e) => {
                  e.preventDefault()
                  delFerie(gf.id)
                }}><TiDeleteOutline size={30}/></p>}
              </Card>
            )
          }): <span className=" d-block bg-white p-2 mt-2 rounded-2">Non hai ancora richiesto delle ferie</span>}
                
          </Col>
        </Row>
      </Container>
    </>
  );
}
