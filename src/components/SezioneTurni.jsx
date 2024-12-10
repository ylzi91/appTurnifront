import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  ListGroup,
  Row,
  ToggleButton,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addAllTurniAction, setDraggedEvent } from "../redux/actions";
import { FaBackspace, FaCheck, FaPen, FaTrashAlt } from "react-icons/fa";

export function SezioneTurni() {
  const dispatch = useDispatch();
  const allTurni = useSelector((state) => state.admin.allTurni);
  const token = useSelector((state)=> state.auth.token)
  const [addNomeTurno, setAddNomeTurno] = useState("")
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
      const response = await fetch(`${import.meta.env.VITE_URL}/turni`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const content = await response.json();
      dispatch(addAllTurniAction(content));
    } catch (error) {
      console.log("Errore nell fetch turni");
    }
  };

  const modTurno = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/turni/${checkMod}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oraInizio: addOraInizio,
            oraFine: addOraFine,
          }),
        }
      );
      const content = await response.json();
      getTurni();
      setCheckMod("");
    } catch (error) {
      const content = await response.json();
      console.log(content);
    }
  };

  

  const addTurno = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/turni`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomeTurno: addNomeTurno,
            oraInizio: addOraInizio,
            oraFine: addOraFine,
            isAfterMidnight: afterMidnight
          }),
        }
      );
      const content = await response.json();
      getTurni();
      setAddNomeTurno("")
    } catch (error) {
      const content = await response.json();
      console.log(content);
    }
  };
  const delTurno = async (turnoDelete) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/turni/${turnoDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
       
        }
      );
      getTurni();
    } catch (error) {
      const content = await response.json();
      console.log(content);
    }
  };
  return (
    <>
      <Container>
        <Row>
          <Col className=" d-flex flex-column align-content-center custom-scrollbar ">
            <h4 className=" p-2 text-center"> I tuoi turni </h4>
            
              {allTurni.map((turno) => {
                return (
                  <>
                  <Dropdown className=" mt-2 ">
                    <Dropdown.Toggle
                      key={turno.nomeTurno}
                      action
                      draggable
                      className=" w-100"
                      onDragStart={() => {
                        handleDragStart({ title: turno.nomeTurno, oreTurno: turno.durataTurno });
                      }}
                    >
                      <span className=" d-block text-bg-secondary text-center rounded-1">{turno.nomeTurno} </span>
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
                  </>
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
                      onClick={(e) => {
                        e.preventDefault()
                        addTurno()
                      }}
                      size="sm"
                      variant="success"
                      className=" mt-2"
                    >
                      Aggiungi
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
