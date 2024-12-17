import { Col, Container, Row } from "react-bootstrap";
import { SezioneTurni } from "./SezioneTurni";
import { SezioneCalendario } from "./SezioneCalendario";



export default function CreazioneTurni (){
    return(
        <>
        <Container fluid>
            <Row>
                <Col md={10}>
                    <h4 className=" bg-body-secondary bg-opacity-75 border border-2 border-white text-info p-2 w-25 rounded-2 text-center mx-auto">Assegnazione turni</h4>
                    <SezioneCalendario/>
                </Col>
                <Col md={2} className=" bg-body-secondary bg-opacity-50" style={{height: '92vh'}}>
                    <SezioneTurni/>
                </Col>
            </Row>
        </Container>
        </>
    )
}