import { Badge, Button, Container, Nav, Navbar } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import Appturn from '../assets/img/Appturn.png'
import useLogout from "../utils/useLogout";

export default function NavUser({ cambIng }) {
  const utente = useSelector((state) => state.user.utente)
  const logout = useLogout()
  return (
    <Navbar expand="lg" collapseOnSelect data-bs-theme="dark" className=" bg-dark mb-2">
      <Container fluid>
        <Navbar.Brand as={Link} to="/user_page/turni"><img className=" rounded-circle" src={Appturn} style={{width: 50}} alt="AppTurni" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/user_page/turni" eventKey="turni">
              Vedi Turni
            </Nav.Link>
            <Nav.Link as={NavLink} to="/user_page/ferie" eventKey="ferie">
              Richiedi ferie
            </Nav.Link>
            <Nav.Link as={NavLink} to="/user_page/vedi_cambi" eventKey="cambi">
              Vedi cambi {(cambIng > 0) && <Badge bg="danger">{cambIng}</Badge>}
            </Nav.Link>
          </Nav>
          <div className=" d-flex align-items-center gap-3 ms-lg-auto">
            <Nav.Link as={NavLink} to="/user_page/me" eventKey="profilo" className=" text-white">
              <img
                src={utente.immagine}
                className=" rounded-circle"
                style={{ width: 30, height: 30 }}
                alt=""
              />{" "}
              {utente.nome} {utente.cognome}
            </Nav.Link>
            <Button variant="outline-light" size="sm" onClick={logout}>
              <CiLogout /> Esci
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
