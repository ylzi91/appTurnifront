import { useRef, useState } from "react";
import {
  Accordion,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { FaPen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeTokenAction, removeRoleAction, addUserAction } from "../redux/actions";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const meUser = useSelector((state) => state.user.utente);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [nome, setNome] = useState(meUser.nome);
  const [cognome, setCognome] = useState(meUser.cognome);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [spinnerNome, setSpinnerNome] = useState(false)
  const [spinnerAvatar, setSpinnerAvatar] = useState(false)
  const [spinnerAggPass, setSpinnerAggPass] = useState(false)
  const [errorePas, setErrorePas] = useState(null)
  const [modNC, setModNC] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [urlImg, setUrlImg] = useState("");

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    try {
      setSpinnerAvatar(true)
      const response = await fetch(
        `${import.meta.env.VITE_URL}/utenti/me/avatar`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const result = await response.json();
        setUrlImg(result.message);
      } else {
        console.error("Error uploading the file:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
    } finally{setSpinnerAvatar(false)}
  };

  const putNomeCognome = async () => {
    try {
      setSpinnerNome(true)
      const response = await fetch(`${import.meta.env.VITE_URL}/utenti/me/nome_cognome`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, cognome }),
      });
      if (!response.ok){
        const content = await response.json()
        throw new Error(content.message);
      }
      else{
        const content = await response.json()
        setNome(content.nome)
        setCognome(content.cognome)
        dispatch(addUserAction(content))
      } 
    } catch (error) {
      console.log("Errore post",error.message);
      
    } finally { setSpinnerNome(false)}
  };

  const patchPassword = async () => {
    if(oldPassword.match(newPassword)){
      setErrorePas({
        message: "Le password non possono essere uguali",
        error: true
      })
      setTimeout(() => {
        setErrorePas(null)
      }, 5000);
      
    }
    else
    try {
      setSpinnerAggPass(true)
      const response = await fetch(`${import.meta.env.VITE_URL}/utenti/me/password`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!response.ok){
        const content = await response.json()
        throw new Error(content.message);
      }
      else {
        setErrorePas({
          message: "Password salvata correttamente",
          error: false
        })
        setTimeout(() => {
          setErrorePas(null)
        }, 5000);
      }
      setNewPassword("")
      setOldPassword("")
      
    } catch (error) {
      setErrorePas({
        message: error.message,
        error: true
      })
      setTimeout(() => {
        setErrorePas(null)
      }, 5000);
      
    } finally {setSpinnerAggPass(false)}
  };


  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Container fluid >
        <Row className=" justify-content-center">
          <Col md={4}>
            <Card className=" d-flex flex-column justify-content-center rounded-5 mb-2">
              <div className=" mx-auto position-relative mt-2">
                <Card.Img
                  variant="top"
                  className="rounded-circle"
                  src={urlImg === "" ? meUser.immagine : urlImg}
                  style={{ height: 200, width: 200 }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Badge
                  onClick={handleButtonClick}
                  className=" bg-warning position-absolute rounded-circle start-0 ms-5 mt-3 p-2 pointer"
                >
                  {!spinnerAvatar ? <FaPen /> : <Spinner animation="border" size="sm" variant="info"/> } 
                </Badge>
              </div>

              <Card.Body className=" d-flex flex-column justify-content-center">
                <Card.Title className=" d-flex align-self-center align-content-center">
                  <div className=" d-flex flex-column justify-content-center">
                  {!modNC ? (
                    <span className=" me-2">
                      {meUser.nome} {meUser.cognome}
                    </span>
                  ) : (
                    <>
                      <Form.Control type="text" onChange={(e) => setNome(e.target.value)} className=" mb-2" value={nome}/>
                      <Form.Control type="text" className="mb-2" onChange={(e) => setCognome(e.target.value)} value={cognome}/>
                      <Button onClick={() => putNomeCognome()}>{!spinnerNome ? "Aggiorna nome e cognome" : <Spinner animation="border" size="sm"/>}</Button>
                    </>
                  )}
                  <FaPen onClick={() => setModNC(!modNC)} className=" d-block rounded-5 w-100 mt-2 text-warning pointer" />
                    </div>
                </Card.Title>
                <Accordion defaultActiveKey={null}>
                  <Accordion.Item>
                    <Accordion.Header>Aggiornamento password</Accordion.Header>
                    <Accordion.Body className=" d-flex flex-column">
                      <Form.Control
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Vecchia password"
                        type="password"
                        className=" mb-2"
                      />
                      <Form.Control
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nuova password"
                        type="password"
                        className="mb-2"
                      />
                      <Button variant="primary" disabled={spinnerAggPass ? true : false} className=" mx-auto" onClick={(e) => {
                        e.preventDefault()
                        patchPassword()
                      }}>
                        {spinnerAggPass && <Spinner animation="border" size="sm"/>} Aggiorna password
                      </Button>
                      {errorePas === null ? "" : errorePas.error ? <span className=" text-danger">{errorePas.message}</span> : <span className=" text-success">{errorePas.message}</span>}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
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
