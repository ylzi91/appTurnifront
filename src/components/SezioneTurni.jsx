import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  ListGroup,
  Row,
  Spinner,
  ToggleButton,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addAllTurniAction, setDraggedEvent } from "../redux/actions";
import { FaBackspace, FaCheck, FaPen, FaTrashAlt } from "react-icons/fa";
import useApi from "../utils/useApi";
import { useNotifiche } from "./Notifiche";

export function SezioneTurni() {
  const dispatch = useDispatch();
  const[allTurni,setAllTurni] = useState([])
  const api = useApi()
  const { notifica } = useNotifiche()
  const [addNomeTurno, setAddNomeTurno] = useState("")
  const [spinnerAddTurno, setSpinnerAddTurno] = useState(false)
  const [spinnerTurni, setSpinnerTurni] = useState(false)
  const [addOraInizio, setAddOraInizio] = useState(null);
  const [addOraFine, setAddOraFine] = useState(null);
  const [afterMidnight, setAfterMidnght] = useState(false)
  const [checkMod, setCheckMod] = useState("");
  const [deleteTurno, setDeleteTurno] = useState("")

  useEffect(() => {
    getTurni();
  }, []);

  const handleDragStart = (turno) => {
    dispatch(setDraggedEvent(turno));
  };

  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const getTurni = async () => {
    try {
      setSpinnerTurni(true)
      const content = await api("/turni");
      // Senza turni il backend risponde con un messaggio invece di una lista
      setAllTurni(Array.isArray(content) ? content : [])
    } catch (error) {
      notifica(error.message);
    } finally {
      setSpinnerTurni(false)
    }
  };

  const modTurno = async () => {
    try {
      await api(`/turni/${checkMod}`, {
        method: "PATCH",
        body: { oraInizio: addOraInizio, oraFine: addOraFine },
      });
      getTurni();
      setCheckMod("");
    } catch (error) {
      notifica(error.message);
    } finally {
      setAddOraFine(null)
      setAddOraInizio(null)
    }
  };

  const addTurno = async () => {
    try {
      setSpinnerAddTurno(true)
      await api("/turni", {
        method: "POST",
        body: {
          nomeTurno: addNomeTurno,
          oraInizio: addOraInizio,
          oraFine: addOraFine,
          isAfterMidnight: afterMidnight,
        },
      });
      getTurni();
      setAddNomeTurno("")
    } catch (error) {
      notifica(error.message);
    } finally { setSpinnerAddTurno(false)}
  };

  const delTurno = async (turnoDelete) => {
    try {
      await api(`/turni/${turnoDelete}`, { method: "DELETE" });
      getTurni();
    } catch (error) {
      notifica(error.message);
    }
  };
  return (
    <>
      <Container>
        <Row>
          <h4 className=" mt-2 p-2 text-center bg-info text-white rounded-2 border border-2 border-white"> I tuoi turni </h4>
          <Col className=" d-flex flex-column align-content-center custom-scrollbar py-2">
            
            
              {spinnerTurni ? <Spinner className=" align-self-center" variant="info" animation="border"/> : [...allTurni].sort((turnA, turnB) => {
                let oraA = turnA.oraInizio ? turnA.oraInizio?.split(':')?.map(Number) : [0]
                let oraB = turnB.oraInizio ? turnB.oraInizio?.split(':')?.map(Number) : [0]
                return oraA[0] - oraB[0] 
              }
              )?.map((turno) => {
                return (
                  <Fragment key={turno.nomeTurno}>
                  <Dropdown className=" mt-2">
                    <Dropdown.Toggle
                      draggable
                      className=" w-100 border border-2 shadow border-white rounded-5"
                      onDragStart={() => {
                        handleDragStart({ title: turno.nomeTurno, oreTurno: turno.durataTurno });
                      }}
                    >
                      <span className=" d-block text-bg-secondary text-center rounded-5 w-25 mx-auto">{turno.nomeTurno} </span>
                      {checkMod !== turno.nomeTurno ? (
                        <span>
                          {JSON.stringify(turno.oraInizio)
                            ?.slice(0, -4)
                            .slice(1)}{" "}
                          /{" "}
                          {JSON.stringify(turno.oraFine)?.slice(0, -4).slice(1)}
                        </span>
                      ) : (
                        <form
                          className=" d-flex flex-column"
                          onSubmit={(e) => {
                            e.preventDefault();
                            modTurno();
                          }}
                        >
                          <Form.Select
                            size="sm"
                            onChange={(e) => setAddOraInizio(e.target.value)}
                          >
                            {generateTimeSlots().map((gt) => {
                              return (
                                <option value={gt} key={gt}>
                                  {gt}
                                </option>
                              );
                            })}
                          </Form.Select>

                          <Form.Select
                            size="sm"
                          
                            onChange={(e) => setAddOraFine(e.target.value)}
                          >
                            {generateTimeSlots().map((gt) => {
                              return (
                                <option value={gt} key={gt}>
                                  {gt}
                                </option>
                              );
                            })}
                          </Form.Select>
                          <Button type="submit" size="sm" variant="success">
                        
                            <FaCheck />
                          </Button>  
                          <Button variant="danger" size="sm" onClick={(e) => {
                            e.preventDefault()
                            setCheckMod("")
                            setAddOraFine("")
                            setAddOraInizio("")
                          }}><FaBackspace/></Button>
                        </form>
                      )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className=" w-100">
                      <Dropdown.Item className=" d-flex justify-content-evenly my-1">
                      <Button variant="danger" onClick={(e) => {
                        e.preventDefault()
                        delTurno(turno.nomeTurno)
                    
                      }}>
                        <FaTrashAlt />
                      </Button>
                      <ToggleButton
                        variant={
                          checkMod !== turno.nomeTurno
                            ? "outline-warning"
                            : "warning"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          checkMod !== turno.nomeTurno
                            ? (setCheckMod(turno.nomeTurno),
                              setAddOraInizio(turno.oraInizio),
                              setAddOraFine(turno.oraFine))
                            : setCheckMod("");
                          setAddOraInizio("");
                          setAddOraFine("");
                        }}
                      >
                        <FaPen />
                      </ToggleButton>
                    </Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                  </Fragment>
                );
              })}
            

            
            <Accordion
              defaultActiveKey={null}
              className=" mt-2 position-fixed bottom-0"
            >
              <Accordion.Item>
                <Accordion.Header>Aggiungi Turno</Accordion.Header>
                <Accordion.Body>
                  <form className=" mt-2 d-flex flex-column">
                    <Form.Control
                      type="text"
                      value={addNomeTurno}
                      maxLength={2}
                      placeholder="Nome turno"
                      onChange={(e) => {
                        e.preventDefault()
                        setAddNomeTurno(e.target.value)
                      } }
                    />
                    <Form.Text>
                      Il turno deve essere massimo 2 caratteri{" "}
                    </Form.Text>
                    Ora inizio
                    <Form.Select
                      size="sm"
                      onChange={(e) => setAddOraInizio(e.target.value)}
                    >
                      {generateTimeSlots().map((gt) => {
                        return (
                          <option value={gt} key={gt}>
                            {gt}
                          </option>
                        );
                      })}
                    </Form.Select>
                    Ora fine
                    <Form.Select
                      size="sm"
                      onChange={(e) => setAddOraFine(e.target.value)}
                    >
                      {generateTimeSlots().map((gt) => {
                        return (
                          <option value={gt} key={gt}>
                            {gt}
                          </option>
                        );
                      })}
                    </Form.Select>
                    <Form.Check label="Turno a cavallo della mezzanotte" value={afterMidnight} onChange={(e) => setAfterMidnght(e.target.checked)}/>
                    
                    <Button
                      disabled={(addNomeTurno && addOraInizio && addOraFine) ? false : true}
                      onClick={(e) => {
                        e.preventDefault()
                        addTurno()
                      }}
                      size="sm"
                      variant="success"
                      className=" mt-2"
                    >
                      {spinnerAddTurno && <Spinner animation="border" size="sm"/>}Aggiungi
                    </Button>
                  </form>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </>
  );
}
