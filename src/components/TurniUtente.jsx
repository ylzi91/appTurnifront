import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Button, Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TurniUtente() {
  const [utenti, setUtenti] = useState([]);
  const [events, setEvents] = useState([]);
  const [utenteTurni, setUtenteTurni] = useState([]);
  const auth = useSelector((state) => state.auth);
  const localizer = momentLocalizer(moment);

  moment.updateLocale("it", {
    week: {
      dow: 1, 
    },
  });
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

  const currentUtente = useSelector((state) => state.user.utente)

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Mese è 0-indicizzato
  };



  const getEventsForCalendar = (calendarId) => {
    return events.filter((event) => event.calendarId === calendarId);
  };

  
  const handleNavigate = (newDate) => {
    const newMonday = getMonday(newDate)
    setDate(newMonday);
    console.log(date);
  };

  useEffect(() => {
    getUtenti();
    getTurniUtente();
    console.log(date)
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
                <Col md={2} className="align-content-center mt-2">
              
                 {utente.email === currentUtente.email && <Button variant="warning" className=" w-100">{utente.nome} {utente.cognome}</Button>} 
                 {utente.email !== currentUtente.email && (
                    <Dropdown>
                      <Dropdown.Toggle variant="success" className=" w-100 text-white">
                        {utente.nome} {utente.cognome}
                      </Dropdown.Toggle>
                        <Dropdown.Menu className=" w-100 text-center">
                          <Link to={`/user_page/cambioturno/${utente.email}`}  className=" dropdown-item">Richiedi cambio</Link>
                        </Dropdown.Menu>
                    </Dropdown>
                 )}
                </Col>
                <Col md={10} className=" border-bottom border-1 border-black py-2">
                  <Calendar
                    localizer={localizer}
                    defaultDate={getCurrentWeekMonday()}
                    date={date}
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
