import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";
import { Calendar } from "react-big-calendar";
import { formatiCalendario, localizer, messaggiCalendario } from "../utils/calendario";
import useIsMobile from "../utils/useIsMobile";
import EventoAgenda from "./EventoAgenda";
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TurniUtente() {
  const isMobile = useIsMobile();
  const [utenti, setUtenti] = useState([]);
  const [events, setEvents] = useState([]);
  const [utenteTurni, setUtenteTurni] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mailUt, setMailUt] = useState("");
  const api = useApi();
  const { notifica } = useNotifiche();

  /////////////////////////
  const getCurrentWeekMonday = () => {
    const today = new Date();
    return getMonday(today);
  };

  const getMonday = (date) => {
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
    return monday;
  };
  const [date, setDate] = useState(getCurrentWeekMonday());
  //////////////////////

  const currentUtente = useSelector((state) => state.user.utente);

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Mese è 0-indicizzato
  };

  const getEventsForCalendar = (calendarId) => {
    return events.filter((event) => event.calendarId === calendarId);
  };

  const handleNavigate = (newDate) => {
    const newMonday = getMonday(newDate);
    setDate(newMonday);
  };

  useEffect(() => {
    getUtenti();
    getTurniUtente();
  }, [date]);

  const getUtenti = async () => {
    try {
      const content = await api("/utenti");
      setUtenti(content);
    } catch (error) {
      notifica(error.message);
    }
  };
  const handleUtente = (ut) => {
    if (mailUt === "") return utenti;
    else return ut.email === currentUtente.email;
  };
  const handleMail = (mail) => {
    if (mailUt === "") setMailUt(mail);
    else setMailUt("");
  };

  const handleSelEvent = (event) => {
    if(selectedEvent && selectedEvent.idFromDb === event.idFromDb)
      setSelectedEvent(null)
    else
      setSelectedEvent(event)
  }

  const getTurniUtente = async () => {
    try {
      const content = await api(`/utenteturno/settimanali?dataInizio=${date.toLocaleDateString("en-CA")}`);
      setUtenteTurni(content);

      const newEvents = content.map((turno, index) => ({
        id: index,
        idFromDb: turno.id,
        title: turno.turno.nomeTurno,
        start: parseDate(turno.giornoTurno),
        end: parseDate(turno.giornoTurno),
        calendarId: turno.utente.email,
        oraInizio: turno.turno.oraInizio,
        oraFine: turno.turno.oraFine,
        totOre: turno.turno.durataTurno
      }));
      setEvents(newEvents);
    } catch (error) {
      notifica(error.message);
    }
  };

  return (
    <>
      <Container>
        {utenti
          .filter((utente) => handleUtente(utente))
          .map((utente) => {
            return (
              <>
                <Row className=" bg-body-secondary rounded-2 mt-2 border border-2 border-white mx-1 mb-2 pb-2">
                  <Col md={2} className="align-content-center mt-2">
                    {utente.email === currentUtente.email && (
                      <>
                        {" "}
                        <Button
                          variant="info"
                          onClick={(e) => {
                            e.preventDefault();
                            handleMail(currentUtente.email);
                          }}
                          className=" w-100 text-white mb-2"
                        >
                          <img src={utente.immagine} width={50} height={50} className=" rounded-circle"/> {utente.nome} {utente.cognome} 
                        </Button>
                        <span className=" bg-info p-1 rounded-2 text-warning">
                          Ore settimanali: {events.reduce((acc, curev) => {
                        if(curev.calendarId === utente.email)
                          return acc + curev.totOre
                        else
                          return acc
                      }, 0)}
                        </span>
                      </>
                    )}
                    {utente.email !== currentUtente.email && (
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="success"
                          className=" w-100 text-white"
                        >
                          {utente.nome} {utente.cognome}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className=" w-100 text-center">
                          <Link
                            to={`/user_page/cambioturno/${utente.email}`}
                            className=" dropdown-item"
                          >
                            Richiedi cambio
                          </Link>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </Col>
                  <Col md={10} className=" py-2">
                    <Calendar
                      className=" bg-body-tertiary p-2 rounded-2 text-info shadow"
                      localizer={localizer}
                      culture="it"
                      formats={formatiCalendario}
                      messages={messaggiCalendario}
                      defaultDate={getCurrentWeekMonday()}
                      date={date}
                      events={getEventsForCalendar(utente.email)}
                      onNavigate={handleNavigate}
                      defaultView={isMobile ? "agenda" : "week"}
                      views={isMobile ? ["agenda"] : ["week"]}
                      length={7}
                      startAccessor="start"
                      endAccessor="end"
                      selectable={true}
                      onSelectEvent={handleSelEvent}
                      components={{
                        agenda: { event: EventoAgenda, time: () => null },
                        event: ({ event }) => (
                          <span style={{ fontSize: "0.8em" }}>
                            {event.title} <br />
                            {event.oraInizio?.slice(0, -3)}
                            <br />
                            {event.oraFine?.slice(0, -3)}
                          </span>
                        ),
                      }}
                    />
                    
                  </Col>
                  <Col>{selectedEvent?.calendarId === utente.email ? <span>Dalle {selectedEvent?.oraInizio?.slice(0,-3)} alle {selectedEvent?.oraFine?.slice(0,-3)}</span> : <span>Seleziona turno per vedere l'orario</span>} </Col>
                </Row>
              </>
            );
          })}
      </Container>
    </>
  );
}
