import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addRoleAction, addTokenAction } from "../redux/actions";
import   Appturn  from '../assets/img/Appturn.png'
import { apiFetch } from "../utils/api";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState(null);
  const myToken = useSelector((state) => state.auth.token);
  const myRole = useSelector((state) => state.auth.role);
  useEffect(() => {
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
      setErrorLogin(null);
      const content = await apiFetch("/auth/login", { method: "POST", body: { email, password } });
      dispatch(addTokenAction(content.accessToken));
      dispatch(addRoleAction(content.role));
      navigate(content.role === "USER" ? "/user_page/me" : "/admin_page/creazione_turni");
    } catch (error) {
      setErrorLogin(error.message);
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
                    {errorLogin && (
                      <Alert variant="danger" className="py-2">
                        {errorLogin}
                      </Alert>
                    )}
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
