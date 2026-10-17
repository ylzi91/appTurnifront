import { Badge } from "react-bootstrap";

// Riga del turno nella vista elenco (mobile) del calendario
export default function EventoAgenda({ event }) {
  return (
    <span>
      <Badge bg="info" className=" me-2">{event.title}</Badge>
      {event.oraInizio?.slice(0, -3)}
      {event.oraInizio && " – "}
      {event.oraFine?.slice(0, -3)}
    </span>
  );
}
