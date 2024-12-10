import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
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
  const [utenti, setUtenti] = useState([]);
  const [events, setEvents] = useState([]);
  const [utenteTurni, setUtenteTurni] = useState([]);
  const [mailUt, setMailUt] = useState("");
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
    console.log(date);
  };

  useEffect(() => {
    getUtenti();
    getTurniUtente();
    console.log(date);
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
  const handleUtente = (ut) => {
    if (mailUt === "") return utenti;
    else return ut.email === currentUtente.email;
  };
  const handleMail = (mail) => {
    if (mailUt === "") setMailUt(mail);
    else setMailUt("");
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
        oraInizio: turno.turno.oraInizio,
        oraFine: turno.turno.oraFine,
        totOre: turno.turno.durataTurno
      }));
      setEvents(newEvents);
    } catch (error) {
      console.log("Errore nell fetch turni");
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
                <Row className=" bg-body-secondary rounded-2 mt-4">
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
                          {utente.nome} {utente.cognome}
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
                      defaultDate={getCurrentWeekMonday()}
                      date={date}
                      events={getEventsForCalendar(utente.email)}
                      onNavigate={handleNavigate}
                      defaultView="week"
                      views={["week"]}
                      startAccessor="start"
                      endAccessor="end"
                      selectable={false}
                      components={{
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
                </Row>
              </>
            );
          })}
      </Container>
    </>
  );
}
