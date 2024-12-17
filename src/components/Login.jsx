import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRoleAction, addTokenAction } from "../redux/actions";
import   Appturn  from '../assets/img/Appturn.png'

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const myToken = useSelector((state) => state.auth.token);
  const myRole = useSelector((state) => state.auth.role);
  useEffect(() => {
    console.log(myToken);
    if (myToken !== "") {
      switch (myRole) {
        case "ADMIN": {
          navigate("/admin_page/creazione_turni");
          break;
        }
        case "USER": {
          navigate("/user_page/me");
          break;
        }
        case "CAPO": {
          navigate("/admin_page/creazione_turni");
          break;
        }
      }
    }
  }, []);

  const getLogin = async () => {
    try {
      setSpinner(true);
      const response = await fetch(`${import.meta.env.VITE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const content = await response.json();
        dispatch(addTokenAction(content.accessToken));
        dispatch(addRoleAction(content.role));
        switch (content.role) {
          case "ADMIN": {
            navigate("/admin_page/creazione_turni");
            break;
          }
          case "USER": {
            navigate("/user_page/me");
            break;
          }
          case "CAPO": {
            navigate("/admin_page/creazione_turni");
            break;
          }
        }
      } else {
        throw new Error("Errore nel login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSpinner(false);
    }
  };

  return (
    <>
      <Container fluid>
        <Row className=" justify-content-center">
          <Col lg={4} className="">
            <Card className="text-center mx-auto mt-5 bg-body-tertiary">
              <Card.Header><img className=" rounded-circle" src={Appturn} style={{width: 80}} alt=""/></Card.Header>
              <Card.Body>
                <Card.Text>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      getLogin();
                    }}
                  >
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                      <Form.Label>Inidirizzo email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => {
                          e.preventDefault();
                          setEmail(e.target.value);
                        }}
                        placeholder="Inserisci email"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => {
                          e.preventDefault();
                          setPassword(e.target.value);
                        }}
                        placeholder="Password"
                      />
                    </Form.Group>
                    <Button variant="success" type="submit">
                      {!spinner ? (
                        "Effettua Login"
                      ) : (
                        <Spinner animation="border" size="sm" />
                      )}
                    </Button>
                  </Form>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
