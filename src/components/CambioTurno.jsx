import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Calendar } from "react-big-calendar";
import { formatiCalendario, localizer, messaggiCalendario } from "../utils/calendario";
import useIsMobile from "../utils/useIsMobile";
import EventoAgenda from "./EventoAgenda";
import { Button, Col, Container, Row } from "react-bootstrap";

import { useSelector } from "react-redux";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";
import { useCookies } from "react-cookie";

function CambioTurno() {
  const isMobile = useIsMobile();
  const [cookies, setCookie] = useCookies(['utentiRispondenti'])
  const currentUtente = useSelector((state) => state.user.utente);
  const [rispostaRichOk, setRispostaRichOk] = useState(false)
  const [erroreRichiesta, setErroreRichiesta] = useState(null)
  const [utenteCambioObj, setUtenteCambioObj] = useState({});
  const [selectedTurnoCur, setSelectedTurnoCur] = useState(null);
  const [selectedTurnoCam, setSelectedTurnoCam] = useState(null);
  const api = useApi();
  const { notifica } = useNotifiche();
  const [events, setEvents] = useState([]);


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

  const { email } = useParams();

  const utenteCambio = async () => {
    try {
      const content = await api(`/utenti/${email}`);
      setUtenteCambioObj(content);
    } catch (error) {
      notifica(error.message);
    }
  };

  const getTurniUtente = async (utenteMail) => {
    try {
      const content = await api(`/utenteturno/settimanali?dataInizio=${date.toLocaleDateString("en-CA")}&email=${utenteMail}`);

      const newEvents = content.map((turno, index) => ({
        id: index,
        idFromDb: turno.id,
        title: turno.turno.nomeTurno,
        start: parseDate(turno.giornoTurno),
        end: parseDate(turno.giornoTurno),
        calendarId: turno.utente.email,
      }));
      setEvents((prev) => [...prev, ...newEvents]);
    } catch (error) {
      notifica(error.message);
    }
  };

  const richiediCambio = async () => {
    try {
      await api("/cambioturno/me", {
        method: "POST",
        body: {
          nomeTurnoRich: selectedTurnoCur.title,
          dataTurnoRich: selectedTurnoCur.start.toLocaleDateString('en-CA'),
          emailRis: selectedTurnoCam.calendarId,
          nomeTurnoRis: selectedTurnoCam.title,
          dataTurnoRis: selectedTurnoCam.start.toLocaleDateString('en-CA')
        },
      });
      setRispostaRichOk(true)
    } catch (error) {
      setErroreRichiesta(error.message)
    }
  }

  function handleCurSel(event) {
    if(selectedTurnoCur && selectedTurnoCur.idFromDb === event.idFromDb)
      setSelectedTurnoCur(null);
    else
      setSelectedTurnoCur(event)
  }

  function handleCamSel(event) {
    if(selectedTurnoCam && selectedTurnoCam.idFromDb === event.idFromDb)
     setSelectedTurnoCam(null);
    else
      setSelectedTurnoCam(event)
  }

  const handleNavigate = (newDate) => {
    const newMonday = getMonday(newDate);
    setDate(newMonday);
  };

  const getEventsForCalendar = (calendarId) => {
    return events.filter((event) => event.calendarId === calendarId);
  };
  function parseDate(dateString) {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Mese è 0-indicizzato
  }

  useEffect(() => {
    // Ricaricando la pagina l'utente corrente arriva dopo: senza la sua email il calendario resterebbe vuoto
    if (!currentUtente.email) return;
    setEvents([]);
    utenteCambio();
    getTurniUtente(email);
    getTurniUtente(currentUtente.email);
  }, [date, email, currentUtente.email]);

  return (
    <>
      <Container fluid>
        <Row className=" mt-3 py-3">
          <Col>
            {selectedTurnoCur === null && (
              <h4 className=" bg-info text-white p-2 text-center rounded-2">Seleziona sul calendario il tuo turno</h4>
            )}
            {selectedTurnoCur && (
              <h4  className=" bg-info text-white p-2 text-center rounded-2">
                E' stato selezionato il TUO turno {selectedTurnoCur.title} del
                giorno {selectedTurnoCur.start.toLocaleDateString()}
              </h4>
            )}
            {selectedTurnoCam === null && (
              <h4 className=" bg-body-secondary p-2 text-center rounded-2">Seleziona sul calendario il turno del collega</h4>
            )}
            {selectedTurnoCam && (
              <h4 className=" bg-body-secondary p-2 text-center rounded-2">
                E' stato selezionato il turno {selectedTurnoCam.title} di{" "}
                {utenteCambioObj.nome} {utenteCambioObj.cognome} del giorno{" "}
                {selectedTurnoCam.start.toLocaleDateString()}
              </h4>
            )}
          </Col>
        </Row>
        <Row >
          <Col md={2} className=" align-content-center bg-body-secondary pt-2">
            <h6 className=" bg-info text-white p-2 rounded-2 text-center">
              {currentUtente.nome} {currentUtente.cognome}
            </h6>
          </Col>
          <Col md={10} className=" bg-body-secondary pb-2">
            <Calendar
              localizer={localizer}
              culture="it"
              formats={formatiCalendario}
              components={{ agenda: { event: EventoAgenda, time: () => null } }}
              messages={messaggiCalendario}
              date={date}
              events={getEventsForCalendar(currentUtente.email)}
              className=" bg-body-tertiary p-2 rounded-2 text-info shadow"
              onNavigate={handleNavigate}
              defaultView={isMobile ? "agenda" : "week"}
              views={isMobile ? ["agenda"] : ["week"]}
                      length={7}
              startAccessor="start"
              endAccessor="end"
              selectable={true}
              onSelectEvent={handleCurSel}
            />
          </Col>
          <Col md={2} className=" align-content-center mt-2 bg-body-secondary pt-2">
            <h6 className=" bg-warning p-2 rounded-2 text-center">
              {utenteCambioObj.nome} {utenteCambioObj.cognome}
            </h6>
          </Col>
          <Col md={10} className=" bg-body-secondary pb-2">
            <Calendar
              localizer={localizer}
              culture="it"
              formats={formatiCalendario}
              components={{ agenda: { event: EventoAgenda, time: () => null } }}
              messages={messaggiCalendario}
              date={date}
              events={getEventsForCalendar(utenteCambioObj.email)}
              className=" bg-body-tertiary p-2 rounded-2 text-info shadow"
              onNavigate={handleNavigate}
              defaultView={isMobile ? "agenda" : "week"}
              views={isMobile ? ["agenda"] : ["week"]}
                      length={7}
              startAccessor="start"
              endAccessor="end"
              selectable={true}
              onSelectEvent={handleCamSel}
            />
          </Col>
        </Row>
        <Row>
          <Col className=" d-flex flex-column justify-content-center mt-2">
            <Button onClick={(e) => {
                e.preventDefault()
                richiediCambio()
                setCookie('utentiRispondenti', (prevRis) => {
                   return JSON.stringify(...prevRis, utenteCambioObj);
                }, {path: '/'})
            }}>Richiedi cambio</Button>
            <Button variant="secondary" onClick={(e) => {
              e.preventDefault()
              setSelectedTurnoCam(null)
              setSelectedTurnoCur(null)
            }} className=" my-2">Resetta</Button>
            {rispostaRichOk && <p className=" text-success"> Richiesta inviata</p>}
            {erroreRichiesta && <p className=" text-danger">{erroreRichiesta}</p>}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CambioTurno;
