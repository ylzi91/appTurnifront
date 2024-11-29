import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function RichiediFerie() {
  const auth = useSelector((state) => state.auth);
  const [dataInizio, setDataInizio] = useState("");
  const [dataFine, setDataFine] = useState("");

   const postFerie = async () => {
        try{
            const response = await fetch(`${import.meta.env.VITE_URL}/ferie`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${auth.token}`,
                "Content-Type": "application/json"
              },
            
              })
              if(!response.ok)
                throw new Error('Errore nella post ferie')
            } catch (error){
                console.log(error)
            }
          }

  return (
    <>
      <Container >
        <Row  className=" justify-content-center">
          <Col lg={4} >
            <Card >
              <Card.Header>
                <Card.Title>Richiesta ferie</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Label>Data inizio </Form.Label>
                <Form.Control type="date" value={dataInizio} onChange={(e) => setDataInizio(e.target.value)}/>
                  <Form.Label>Data fine </Form.Label>
                <Form.Control type="date" value={dataFine} onChange={(e) => setDataFine(e.target.value)}/>
                <Button>Invia richiesta</Button>
              </Form>
              </Card.Body>
              
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
