import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import { TiDeleteOutline } from "react-icons/ti";

export default function RichiediFerie() {
  const auth = useSelector((state) => state.auth);
  const [errore, setErrore] = useState("")
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
      const response = await fetch(`${import.meta.env.VITE_URL}/ferie`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dataInizio, dataFine }),
      });
      if (!response.ok){
        const content = await response.json()
        throw new Error(content.message);
      }
      else{
        getFerie()
      } 
    } catch (error) {
      console.log("Errore post",error.message);
      setErrore(error.message)
      setTimeout(() => {setErrore("")}, 4000)
    }
  };

  const getFerie = async () => {
    try{
      const response = await fetch(`${import.meta.env.VITE_URL}/ferie/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      })
      if(!response.ok){
        const content = await response.json()
        throw new Error(content.message)
      } 
      else {
        const content = await response.json()
        setGiorniFerie(content)
      }
      
    } catch (error){
      console.log('Errore nella get',error.message)

    }
  }

  const delFerie = async (idFerie) => {
    try{
      const response = await fetch(`${import.meta.env.VITE_URL}/ferie/${idFerie}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      })
      if(!response.ok){
        const content = await response.json()
        throw new Error(content.message)
      } 
      getFerie()
    } catch (error){
      console.log(error)

    }
  }

  useEffect(() => {
    getFerie()
    console.log("ggFerie",giorniFerie)
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
                  <Button className=" mt-2" onClick={postFerie}>Invia richiesta</Button>
                  {errore !== "" && <p className=" text-danger">{errore}</p>}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className=" justify-content-center">
          <Col lg={4}>
          {giorniFerie.length >= 0 ? giorniFerie.map((gf)=> {
            return (
              <Card key={gf.id} className=" mt-2 shadow position-relative"  body>
                <p>Data inizio: {gf.dataInizio}</p>
                <p>Data fine: {gf.dataFine}</p>
                <p>Stato: {gf.statoRichiesta === 'APPROVATO_CAPO' ? "Approvate" : gf.statoRichiesta === 'IN_CORSO' ? "In corso" : "Rifiutate"}</p>
                {gf.statoRichiesta === 'IN_CORSO' && <p className=" position-absolute p-0 top-0 end-0 me-3 mt-2 pointer" onClick={(e) => {
                  e.preventDefault()
                  delFerie(gf.id)
                }}><TiDeleteOutline size={30}/></p>}
              </Card>
            )
          }): "Non hai ancora richiesto delle ferie"}
                
          </Col>
        </Row>
      </Container>
    </>
  );
}
