import { Col, Container, Row } from "react-bootstrap";
import { SezioneTurni } from "./SezioneTurni";
import { SezioneCalendario } from "./SezioneCalendario";



export default function CreazioneTurni (){
    return(
        <>
        <Container fluid>
            <Row>
                <Col md={10}>
                    <SezioneCalendario/>
                </Col>
                <Col md={2} className=" bg-body-secondary" style={{height: '92vh'}}>
                    <SezioneTurni/>
                </Col>
            </Row>
        </Container>
        </>
    )
}