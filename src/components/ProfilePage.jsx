import { useState } from "react";
import { Badge, Button, Card, Col, Container, Dropdown, Row } from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeTokenAction, removeRoleAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const meUser = useSelector((state) => state.user.utente);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [modNC, setModNC] = useState(false);

  return (
    <>
      <Container fluid>
        <Row className=" justify-content-center">
          <Col md={4}>
            <Card className=" d-flex flex-column justify-content-center rounded-5">
              <div className=" w-50 mx-auto position-relative mt-2">
                <Card.Img
                  variant="top"
                  className="rounded-circle"
                  src={meUser.immagine}
                />
                <Badge className=" position-absolute rounded-circle start-0 ms-5 mt-3 p-2 pointer">
                  <FaPen />
                </Badge>
              </div>

              <Card.Body className=" d-flex flex-column justify-content-center">
                <Card.Title className=" d-flex align-self-center align-content-center">
                  <span className=" me-2">
                    {meUser.nome} {meUser.cognome}
                  </span>{" "}
                  <Badge className=" pointer bg-warning">
                    <FaPen />
                  </Badge>{" "}
                </Card.Title>
                <Button variant="primary" className="w-50 mx-auto">
                  Aggiorna
                </Button>
              </Card.Body>
              <Card.Footer className=" d-flex justify-content-center">
                <Dropdown>
                  <Dropdown.Toggle variant="danger" id="dropdown-basic">
                    Esci
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <span className=" d-block ms-3">Sei sicuro?</span>
                    <Dropdown.Item
                      onClick={() => {
                        dispatch(removeTokenAction());
                        dispatch(removeRoleAction());
                        navigate("/");
                      }}
                    >
                      Si
                    </Dropdown.Item>
                    <Dropdown.Item>No</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
