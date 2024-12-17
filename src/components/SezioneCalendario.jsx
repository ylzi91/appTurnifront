import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/it";
import { Calendar, momentLocalizer } from "react-big-calendar";

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
const localizer = momentLocalizer(moment);

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
  const [utenti, setUtenti] = useState([]);
  const [utenteTurni, setUtenteTurni] = useState([]);
  const [utenteTurniDelete, setUtenteTurniDelete] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const titleCounts = {};
  const dispatch = useDispatch();

  moment.updateLocale("it", {
    week: {
      dow: 1,
    },
  });

  const handleNavigate = (newDate) => {
    setDate(newDate);
    console.log(date);
  };
  /*const handleDragStart = (event) => {
      setDraggedEvent(event);
    };*/

  const deleteEvent = useCallback((event, calendarId) => {
    console.log("event", event);
    setUtenteTurniDelete((prev) => [...prev, event]);
    console.log("Eliminati", utenteTurniDelete);
    setEvents((prev) =>
      prev.filter((ev) => ev.id !== event.id || ev.calendarId !== calendarId)
    );
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    console.log(selectedEvent);
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
    console.log(date);
    console.log("bello", import.meta.env.URL);
  }, [date]);

  useEffect(() => {
    console.log("efevervre", events);
  }, [events]);

  const getUtenti = async () => {
    try {
      setSpinnerCalendar(true);
      const response = await fetch(`${import.meta.env.VITE_URL}/utenti`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const content = await response.json();
      setUtenti(content);
      dispatch(addAllUtentiAction(content));
    } catch (error) {
      console.log("Errore nell fetch turni");
    } finally {
      setSpinnerCalendar(false);
      //getTurniUtente()
    }
  };

  const parseDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day); // Mese è 0-indicizzato
  };

  const getTurniUtente = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_URL
        }/utenteturno/settimanali?dataInizio=${date.toLocaleDateString(
          "en-CA"
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if(response.ok){
        const content = await response.json();
      //setUtenteTurni(content);
      //dispatch(addAllUtentTurniAction(content));
      
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
      console.log("NewEvents",newEvents)
      setEvents(newEvents);
      }
      else {
        const content = await response.json()
        throw new Error(content)
      }
      
    } catch (error) {
      console.log("content", error);
    }
  };

  const deleteAndUpdateTurni = async () => {
    try {
      setSpinnerUpdate(true);
      const response = await fetch(`${import.meta.env.VITE_URL}/utenteturno`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          utenteTurniDelete.map((utd) => {
            return {
              nomeTurno: utd.title,
              dataTurno: utd.start.toLocaleDateString("en-CA"),
              emailDipendente: utd.calendarId,
              idFromDb: utd.idFromDb,
            };
          })
        ),
      });
      setUtenteTurniDelete([]);
      console.log("eventi", events);
      setSpinnerUpdate(true);
      const response2 = await fetch(`${import.meta.env.VITE_URL}/utenteturno`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          events.map((ev) => {
            return {
              nomeTurno: ev.title,
              dataTurno: ev.start.toLocaleDateString("en-CA"),
              emailDipendente: ev.calendarId,
              idFromDb: ev.idFromDb,
            };
          })
        ),
      });
      getTurniUtente();

      const content = await response2.json();
    } catch (error) {
      console.log("Errore nell'update");
    } finally {

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
        useDispatch(setDraggedEvent(null));
      }
    },
    [draggedEvent]
  );

  const moveEvent = useCallback((calendarId, { event, start, end }) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
    );
  }, []);

  const getEventsForCalendar = (calendarId) => {
    return events.filter((event) => event.calendarId === calendarId);
  };

  return (
    <>
      <Container fluid className=" mb-2 custom-scrollbar bg-body-tertiary py-2 bg-opacity-75 rounded-2 border border-2 border-white">
        
        {spinnerCalendar ? <Spinner
            className=" fs-2 align-self-center"
            variant="secondary"
            animation="border"
          /> : utenti.sort((utenteA, utenteB) => {
          if(utenteB.cognome > utenteA.cognome)
            return -1
          else if (utenteB.cognome < utenteA.cognome)
            return 1
          else
            return 0
        }).map((utente, index) => {
          return (
            <>
              <Row className=" mt-2 bg-body-secondary p-2 border border-1 border-black rounded-1">
                <Col md={2} className=" align-self-center">
                  <div className=" d-flex justify-content-beetween bg-info p-2 rounded-2 text-white">
                    <img
                      src={utente.immagine}
                      className=" rounded-circle"
                      width={50}
                      height={50}
                    />{" "}
                    <h6 className=" align-self-center mb-0 ms-2">{utente.nome} {utente.cognome}</h6>
                  </div>
                </Col>
                <Col md={9} className="mt-2">
                  <DnDCalendar
                    className=" bg-body-tertiary p-2 rounded-2 text-info"
                    localizer={localizer}
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
                       
                           <div className=" d-flex align-content-center justify-content-between flex-wrap">
                            <div className=" d-flex align-self-center">{event.title}</div>
                            <div style={{fontSize: 6}} className=" d-flex align-self-center">
                              {event?.oraInizio?.slice(0, -3)}{" / "}
                              {event?.oraFine?.slice(0, -3)}
                            </div>
                            
                         
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteEvent(event, utente.email);
                                }}
                                className="rounded-circle"
                              >
                                <FaTrashAlt />
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
                      if (event.idFromDb === null) {
                        return {
                          className: " bg-warning",
                        };
                      } else {
                        return {
                          className: "",
                        };
                      }
                    }}
                  />
                </Col>
                <Col
                  md={1}
                  className=" align-self-center p-2 rounded-2 bg-info text-white"
                >
                  <h6>Ore settimanali</h6>
                  {events?.reduce((acc, curev) => {
                    if (curev.calendarId === utente.email)
                      return acc + curev.oreTurno;
                    else return acc;
                  }, 0)}
                </Col>
              </Row>
            </>
          );
        })}
      </Container>

      <Button
        disabled={
          events.findIndex(
            (event) => event.idFromDb === null || utenteTurniDelete.length > 0
          ) === -1
            ? true
            : false
        }
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
