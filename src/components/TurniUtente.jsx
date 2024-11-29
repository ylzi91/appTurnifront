import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Col, Container, Row } from "react-bootstrap";

export default function TurniUtente() {
  const [utenti, setUtenti] = useState([]);
  const [events, setEvents] = useState([]);
  const [utenteTurni, setUtenteTurni] = useState([]);
  const auth = useSelector((state) => state.auth);
  const localizer = momentLocalizer(moment);
  const [date, setDate] = useState(new Date());
  const currentUtente = useSelector((state) => state.user.utente)

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Mese è 0-indicizzato
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
    console.log(date);
  };

  const getEventsForCalendar = (calendarId) => {
    return events.filter((event) => event.calendarId === calendarId);
  };

  const getCurrentWeekMonday = () => {

    const day = date.getDay();

    const currentMonday = new Date(date);

    currentMonday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));

  
    return currentMonday;
  };

  useEffect(() => {
    getUtenti();
    getTurniUtente();
  }, [date]);

  const getUtenti = async () => {
    try {
      const response = await fetch("http://localhost:3001/utenti", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });
      const content = await response.json();
      setUtenti(content);
    } catch (error) {
      console.log("Errore nell fetch utenti");
    }
  };

  const getTurniUtente = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/utenteturno/settimanali?dataInizio=${date.toLocaleDateString(
          "en-CA"
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const content = await response.json();
      setUtenteTurni(content);

      const newEvents = content.map((turno, index) => ({
        id: index,
        idFromDb: turno.id,
        title: turno.turno.nomeTurno,
        start: parseDate(turno.giornoTurno),
        end: parseDate(turno.giornoTurno),
        calendarId: turno.utente.email,
      }));
      setEvents(newEvents);
    } catch (error) {
      console.log("Errore nell fetch turni");
    }
  };

  return (
    <>
      <Container>
        <Row>
          {utenti.map((utente) => {
            return (
              <>
                <Col md={2} className="align-content-center">
                 <span className={utente.email === currentUtente.email ? "bg-warning p-2 d-block text-center" : " d-block bg-info p-2 text-center"}>{utente.nome} {utente.cognome}</span> 
                </Col>
                <Col md={10} className=" border-bottom border-1 border-black py-2">
                  <Calendar
                    
                    localizer={localizer}
                    date={getCurrentWeekMonday()}
                    events={getEventsForCalendar(utente.email)}
                    onNavigate={handleNavigate}
                    defaultView="week"
                    views={["week"]}
                    startAccessor="start"
                    endAccessor="end"
                    selectable={false}
                  />
                </Col>
              </>
            );
          })}
        </Row>
      </Container>
    </>
  );
}
