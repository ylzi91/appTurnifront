import React, { useCallback, useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import { localizer, messaggiCalendario } from "../utils/calendario";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
  Spinner,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addAllUtentiAction,
  addAllUtentTurniAction,
  setDraggedEvent,
} from "../redux/actions";
import { FaTrashAlt } from "react-icons/fa";
const DnDCalendar = withDragAndDrop(Calendar);

export function SezioneCalendario() {
  const [events, setEvents] = useState([]);
  ////////////////////////////////////////Data il lunedi
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
  //////////////////////////////////////////////////////////////////
  const draggedEvent = useSelector((state) => state.draggedEvent.dragEvent);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [spinnerCalendar, setSpinnerCalendar] = useState(false);
  const [spinnerUpdate, setSpinnerUpdate] = useState(false);
  const [oreMensUtenti, setOreMensUtenti] = useState([]);
  const [settMens, setSettMens] = useState(false);
  const [utenti, setUtenti] = useState([]);
  const [utenteTurni, setUtenteTurni] = useState([]);
  const [utenteTurniDelete, setUtenteTurniDelete] = useState([]);
  const api = useApi();
  const { notifica } = useNotifiche();
  const titleCounts = {};
  const dispatch = useDispatch();

  const modificheNonSalvate =
    events.some((event) => event.idFromDb === null) || utenteTurniDelete.length > 0;

  const handleNavigate = (newDate) => {
    if (
      modificheNonSalvate &&
      !window.confirm("Hai modifiche non salvate: cambiando settimana andranno perse. Continuare?")
    )
      return;
    setUtenteTurniDelete([]);
    setDate(newDate);
  };

  // Avvisa anche se si chiude o si ricarica la pagina con modifiche non salvate
  useEffect(() => {
    if (!modificheNonSalvate) return;
    const avvisa = (e) => e.preventDefault();
    window.addEventListener("beforeunload", avvisa);
    return () => window.removeEventListener("beforeunload", avvisa);
  }, [modificheNonSalvate]);
  /*const handleDragStart = (event) => {
      setDraggedEvent(event);
    };*/

  const deleteEvent = useCallback((event, calendarId) => {
    setUtenteTurniDelete((prev) => [...prev, event]);
    setEvents((prev) =>
      prev.filter((ev) => ev.id !== event.id || ev.calendarId !== calendarId)
    );
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };
  const getNextMonday = () => {
    const day = date.getDay();
    const nextMonday = new Date(date);
    nextMonday.setDate(date.getDate() + ((1 + 7 - day) % 7));
    return nextMonday;
  };

  useEffect(() => {
    getUtenti();
    getTurniUtente();
  }, [date]);

  useEffect(() => {
    if(utenti.length > 0){
      oreMensiliUtenti();
    }
   }, [utenti]);

  const getUtenti = async () => {
    try {
      setSpinnerCalendar(true);
      const content = await api("/utenti");
      setUtenti(content);
    } catch (error) {
      notifica(error.message);
    } finally {
      setSpinnerCalendar(false);
    }
  };

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Mese è 0-indicizzato
  };

  const getTurniUtente = async () => {
    try {
      const content = await api(`/utenteturno/settimanali?dataInizio=${date.toLocaleDateString("en-CA")}`);
      const newEvents = content.map((turno, index) => ({
        id: index,
        idFromDb: turno.id,
        title: turno.turno.nomeTurno,
        start: parseDate(turno.giornoTurno),
        end: parseDate(turno.giornoTurno),
        calendarId: turno.utente.email,
        oreTurno: turno.turno.durataTurno,
        oraInizio: turno.turno.oraInizio,
        oraFine: turno.turno.oraFine,
      }));
      setEvents(newEvents);
    } catch (error) {
      notifica(error.message);
    }
  };

  const oreMensiliUtenti = async () => {
    if (utenti.length === 0) return; // senza email il backend rifiuta la richiesta
    const emailForFetch = utenti
      .map((utente) => `emails=${encodeURIComponent(utente.email)}`)
      .join("&");
    const month = date.getMonth();
    const year = date.getFullYear();
    const lastDay = new Date(year, month + 1, 0);
    const firstDay = new Date(year, month, 1);

    try {
      const content = await api(
        `/utenteturno/ore_totali_utente?${emailForFetch}&dataInizio=${firstDay.toLocaleDateString("en-CA")}&dataFine=${lastDay.toLocaleDateString("en-CA")}`
      );
      setOreMensUtenti(content);
    } catch (error) {
      notifica(error.message);
    }
  };

  const deleteAndUpdateTurni = async () => {
    const toDto = (ev) => ({
      nomeTurno: ev.title,
      dataTurno: ev.start.toLocaleDateString("en-CA"),
      emailDipendente: ev.calendarId,
      idFromDb: ev.idFromDb,
    });
    try {
      setSpinnerUpdate(true);
      if (utenteTurniDelete.length > 0)
        await api("/utenteturno", { method: "DELETE", body: utenteTurniDelete.map(toDto) });
      setUtenteTurniDelete([]);
      await api("/utenteturno", { method: "POST", body: events.map(toDto) });
      notifica("Tabella turni aggiornata", "success");
    } catch (error) {
      notifica(error.message);
    } finally {
      // Si ricarica sempre dal server: mostra lo stato vero anche se il salvataggio è fallito a metà
      getTurniUtente();
      oreMensiliUtenti();
      setSpinnerUpdate(false);
    }
  };

  const onDropFromOutside = useCallback(
    (calendarId, { start, end }) => {
      if (draggedEvent) {
        const newEvent = {
          id: events.length + 1,
          idFromDb: null,
          title: draggedEvent.title,
          start,
          end,
          calendarId,
          oreTurno: draggedEvent.oreTurno,
          oraInizio: draggedEvent.oraInizio,
          oraFine: draggedEvent.oraFine,
        };
        setEvents((prev) => [...prev, newEvent]);
        dispatch(setDraggedEvent(null));
      }
    },
    [draggedEvent, dispatch]
  );

  const moveEvent = useCallback((calendarId, { event, start, end }) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
    );
  }, []);

  const getEventsForCalendar = (calendarId) => {
    return events.filter((event) => event.calendarId === calendarId);
  };

  const countEventsByTitleAndDate = (events) => {
    const counts = {};
    events.forEach((event) => {
      const key = `${event.title}-${event.start.toLocaleDateString("en-CA")}`;
      if (!counts[key]) {
        counts[key] = 0;
      }
      counts[key]++;
    });
    return counts;
  };

  const eventCounts = countEventsByTitleAndDate(events);

  return (
    <>
      <Container
        fluid
        className=" mb-2 custom-scrollbar bg-body-tertiary py-2 bg-opacity-75 rounded-2 border border-2 border-white"
      >
        <Row>
          <Col className=" d-flex justify-content-end">
            <p className="mb-0">
              Ore:{" "}
              <span
                className=" text-info text-decoration-underline pointer"
                onClick={() => setSettMens(false)}
              >
                Settimanali
              </span>{" "}
              |{" "}
              <span
                onClick={() => setSettMens(true)}
                className=" text-info text-decoration-underline pointer"
              >
                Mensili
              </span>
            </p>
          </Col>
        </Row>
        {spinnerCalendar ? (
          <Spinner
            className=" fs-2 align-self-center"
            variant="secondary"
            animation="border"
          />
        ) : (
          utenti
            .sort((utenteA, utenteB) => {
              if (utenteB.cognome > utenteA.cognome) return -1;
              else if (utenteB.cognome < utenteA.cognome) return 1;
              else return 0;
            })
            .map((utente, index) => {
              return (
                <React.Fragment key={utente.email}>
                  <Row className=" mt-2 bg-body-secondary p-2 border border-1 border-black rounded-1">
                    <Col md={2} className=" align-self-center">
                      <div className=" d-flex justify-content-beetween bg-info p-2 rounded-2 text-white">
                        <img
                          src={utente.immagine}
                          className=" rounded-circle"
                          width={50}
                          height={50}
                        />{" "}
                        <h6 className=" align-self-center mb-0 ms-2">
                          {utente.nome} {utente.cognome}
                        </h6>
                      </div>
                    </Col>
                    <Col md={9} className="mt-2">
                      <DnDCalendar
                        className=" bg-body-tertiary p-2 rounded-2 text-info"
                        localizer={localizer}
                        culture="it"
                        messages={messaggiCalendario}
                        events={getEventsForCalendar(utente.email)}
                        startAccessor="start"
                        endAccessor="end"
                        selectable
                        defaultView="week"
                        views={["week"]}
                        date={date}
                        onNavigate={handleNavigate}
                        components={{
                          event: ({ event }) => (
                            <div className="d-flex align-items-center justify-content-between gap-1">
                              <div className=" lh-1">
                                <strong>{event.title}</strong>
                                <div style={{ fontSize: "0.7rem" }}>
                                  {event?.oraInizio?.slice(0, -3)}
                                  {event?.oraInizio && "–"}
                                  {event?.oraFine?.slice(0, -3)}
                                </div>
                              </div>
                              <Button
                                variant="danger"
                                size="sm"
                                title="Rimuovi il turno (si salva con «Aggiorna tabella»)"
                                aria-label="Rimuovi il turno"
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteEvent(event, utente.email);
                                }}
                                className=" p-0 px-1 lh-1"
                              >
                                <FaTrashAlt size={10} />
                              </Button>
                            </div>
                          ),
                        }}
                        onDropFromOutside={(args) =>
                          onDropFromOutside(utente.email, args)
                        }
                        onEventDrop={(args) => {
                          moveEvent(utente.email, args);
                        }}
                        onSelectEvent={handleSelectEvent}
                        draggableAccessor={() => true}
                        eventPropGetter={(event) => {
                          const key = `${
                            event.title
                          }-${event.start.toLocaleDateString("en-CA")}`;
                          if (eventCounts[key] == 2) {
                            return {
                              className: "bg-success text-white",
                            };
                          } else if (event.idFromDb === null) {
                            return {
                              className: "bg-warning",
                            };
                          } else {
                            return {
                              className: " bg-secondary",
                            };
                          }
                        }}
                      />
                    </Col>
                    <Col
                      md={1}
                      className=" align-self-center p-2 rounded-2 bg-info text-white"
                    >
                      {!settMens ? (
                        <>
                          <h6>Ore settimanali</h6>

                          {events?.reduce((acc, curev) => {
                            if (curev.calendarId === utente.email)
                              return acc + curev.oreTurno;
                            else return acc;
                          }, 0)}
                        </>
                      ) : (
                        <>
                        <h6>Ore mensili</h6>
                        <span>{oreMensUtenti.filter(ore => ore.email === utente.email).map(ore => ore.sommaOra)}</span>
                        </>
                      )}
                    </Col>
                  </Row>
                </React.Fragment>
              );
            })
        )}
      </Container>

      {modificheNonSalvate && (
        <span className=" badge text-bg-warning me-2">Modifiche non salvate</span>
      )}
      <Button
        disabled={!modificheNonSalvate}
        className=" mb-2"
        onClick={() => {
          deleteAndUpdateTurni();
        }}
      >
        {spinnerUpdate && <Spinner animation="border" size="sm" />} Aggiorna
        tabella
      </Button>

      <ListGroup>
        {/*events
            .filter((event) => {
              const key = `${event.title}-${event.start}`;
              if (!titleCounts[key]) {
                titleCounts[key] = 1;
                return true;
              } else {
                titleCounts[key]++;
                return false;
              }
            })
            .sort((evA, evB) => new Date (evA.start) - new Date(evB.start)).map((event) => {
              const key = `${event.title}-${event.start}`;
              const count = titleCounts[key];
              const displayTitle =
                count > 1 ? `${event.title} x${count}` : event.title;
              return (
                <ListGroupItem key={event.id}>
                  {event.start.toLocaleDateString('en-CA')} {displayTitle}
                </ListGroupItem>
              );
            })*/}
      </ListGroup>
    </>
  );
}
