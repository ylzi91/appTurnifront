import { Badge, Col, Row } from "react-bootstrap";
import { formattaData } from "../utils/format";

// Riepilogo di un cambio turno: chi cede cosa e chi lo riceve, in due blocchi affiancati
export default function CambioInfo({ cambio }) {
  const blocchi = [
    { etichetta: "Richiede", utenteTurno: cambio.utenteRichiedenteTurno },
    { etichetta: "Concede", utenteTurno: cambio.utenteRispondenteTurno },
  ];
  return (
    <Row className=" g-2 mb-3">
      {blocchi.map(({ etichetta, utenteTurno }) => (
        <Col key={etichetta} xs={6}>
          <div className=" bg-body-secondary rounded-3 p-2 h-100 text-center">
            <small className=" text-muted text-uppercase d-block">{etichetta}</small>
            <div className=" fw-semibold">
              {utenteTurno.utente.nome} {utenteTurno.utente.cognome}
            </div>
            <div className=" mb-1">{formattaData(utenteTurno.giornoTurno)}</div>
            <Badge bg="info">Turno {utenteTurno.turno.nomeTurno}</Badge>
          </div>
        </Col>
      ))}
    </Row>
  );
}
