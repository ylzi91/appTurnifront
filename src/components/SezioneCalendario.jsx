
import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import 'moment/locale/it'
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
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addAllUtentiAction, addAllUtentTurniAction, setDraggedEvent } from "../redux/actions";
const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);


export function SezioneCalendario(){
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(new Date());
    const  draggedEvent = useSelector((state) => state.draggedEvent.dragEvent)
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [utenti, setUtenti] = useState([]);
    const [utenteTurni, setUtenteTurni] = useState([])
    const [utenteTurniDelete, setUtenteTurniDelete] = useState([])
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
      console.log("event", event)
      setUtenteTurniDelete((prev) => [...prev, event])
      console.log("Eliminati", utenteTurniDelete)
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
    const getCurrentWeekMonday = () => {
      // Ottiene il giorno della settimana corrente (0 = Domenica, 1 = Lunedì, ..., 6 = Sabato)
      const day = date.getDay();
      
      // Crea una nuova data basata sulla data corrente
      const currentMonday = new Date(date);
      
      // Calcola quanti giorni sottrarre per arrivare al lunedì della settimana corrente
      // Se oggi è domenica (day = 0), sottrae 6 giorni per arrivare al lunedì precedente
      // Altrimenti, sottrae (day - 1) giorni per arrivare al lunedì corrente
      currentMonday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
      
      // Restituisce la data del lunedì della settimana corrente
      return currentMonday;
  };
  
    useEffect(() => {
      getUtenti();
      getTurniUtente()
      console.log(date)
      console.log("bello",import.meta.env.URL)
    }, [date]);
  
    useEffect(()=> {
      console.log("efevervre", events)
    }, [events])
  
  
    const getUtenti = async () => {
      try {
        const response = await fetch("http://localhost:3001/utenti", {
          method: "GET",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3MzI0NjkyMzgsImV4cCI6MTczMjkwMTIzOCwic3ViIjoieWx6aTkxQGdtYWlsLmNvbSJ9.4cTx5qxRszzROLFLzZJVdNsUNAR40UbA5W1a8ONtgEQzs_b2o28j9O2bNtbxJxND`,
            "Content-Type": "application/json",
          },
        });
        const content = await response.json();
        setUtenti(content);
        dispatch(addAllUtentiAction(content))
      } catch (error) {
        console.log("Errore nell fetch turni");
      }
    };      
  
  
    const parseDate = (dateString) => {
          const [year, month, day] = dateString.split('-');
          return new Date(year, month - 1, day); // Mese è 0-indicizzato
        };
  
  
    const getTurniUtente = async () => {
      try {
        const response = await fetch(`http://localhost:3001/utenteturno/settimanali?dataInizio=${date.toLocaleDateString('en-CA')}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3MzI0NjkyMzgsImV4cCI6MTczMjkwMTIzOCwic3ViIjoieWx6aTkxQGdtYWlsLmNvbSJ9.4cTx5qxRszzROLFLzZJVdNsUNAR40UbA5W1a8ONtgEQzs_b2o28j9O2bNtbxJxND`,
            "Content-Type": "application/json",
          },
        });
        const content = await response.json();
        setUtenteTurni(content);
        dispatch(addAllUtentTurniAction(content))
  
  
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
  
    const deleteAndUpdateTurni = async () => {
      try{
          const response = await fetch(`${import.meta.env.VITE_URL}/utenteturno`, {
            method: "DELETE",
            headers:{
              Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3MzI0NjkyMzgsImV4cCI6MTczMjkwMTIzOCwic3ViIjoieWx6aTkxQGdtYWlsLmNvbSJ9.4cTx5qxRszzROLFLzZJVdNsUNAR40UbA5W1a8ONtgEQzs_b2o28j9O2bNtbxJxND`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(utenteTurniDelete.map(utd => {
              return {
                nomeTurno: utd.title,
                dataTurno: utd.start.toLocaleDateString('en-CA'),
                emailDipendente: utd.calendarId,
                idFromDb: utd.idFromDb
              }
            }))
          })
          console.log("eventi", events)
          const response2 = await fetch(`${import.meta.env.VITE_URL}/utenteturno`, {
            method: "POST",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3MzI0NjkyMzgsImV4cCI6MTczMjkwMTIzOCwic3ViIjoieWx6aTkxQGdtYWlsLmNvbSJ9.4cTx5qxRszzROLFLzZJVdNsUNAR40UbA5W1a8ONtgEQzs_b2o28j9O2bNtbxJxND`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(events.map(ev => {
              return {
                nomeTurno: ev.title,
                dataTurno: ev.start.toLocaleDateString('en-CA'),
                emailDipendente: ev.calendarId,
                idFromDb: ev.idFromDb
              }
            }))
            
          })
        getTurniUtente()
        const content = await response2.json();
        } catch (error){
        console.log("Errore nell'update")
      }
    }
    
  
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
        <Container fluid> 
         
          {utenti.map((utente, index) => {
            return (
              <>
                <Row className=" mt-2">
                  <Col md={2} className=" align-self-center">
                    <h4>{utente.nome} {utente.cognome}</h4>
                  </Col>
                  <Col md={10} className="mt-2">
                    <DnDCalendar
                      localizer={localizer}
                      events={getEventsForCalendar(utente.email)}
                      startAccessor="start"
                      endAccessor="end"
                      selectable
                      defaultView="week"
                      date={getCurrentWeekMonday()}
                      onNavigate={handleNavigate}
                      components={{
                        event: ({ event }) => (
                          <span>
                            {event.title}
                            <Button
                              variant="danger"
                              onClick={() => deleteEvent(event, utente.email)}
                              className=" ms-2"
                            >
                              X
                            </Button>
                          </span>
                        ),
                      }}
                      onDropFromOutside={(args) => onDropFromOutside(utente.email, args)}
                      onEventDrop={(args) => {
                        moveEvent(utente.email, args);
                      }}
                      onSelectEvent={handleSelectEvent}
                      draggableAccessor={() => true}
                    />
                  </Col>
                
                 </Row>
              </>
            );
          })}
             
         
        </Container>
  

  
        <Button onClick={deleteAndUpdateTurni}>Pulsante volante</Button>
        <ListGroup>
          {events
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
            })}
        </ListGroup>
        
      </>
    );
  
   
    
   
}