import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import   Appturn  from '../assets/img/Appturn.png'

export default function NavUser({ cambIng }) {
    const utente = useSelector((state) => state.user.utente)
  return (
    <Navbar expand="lg" data-bs-theme="dark" className=" bg-dark mb-2">
      <Container fluid>
        <Navbar.Brand href="#home"><img className=" rounded-circle" src={Appturn} style={{width: 50}} alt="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/user_page/turni" className=" nav-link">
              Vedi Turni
            </Link>
            <Link to="/user_page/ferie" className=" nav-link">
              Richiedi ferie
            </Link>
            <Link to="/user_page/vedi_cambi" className=" nav-link">Vedi cambi {(cambIng > 0) && <Badge bg="danger">{cambIng}</Badge>} </Link>
          </Nav>
          <div className=" d-flex align-items-center justify-content-end w-25">
            <Link
              to="/user_page/me"
              className=" nav-link align-self-center me-3 text-white"
            >
              <img
                src={utente.immagine}
                className=" rounded-circle"
                style={{ width: 30, height:30 }}
              />{" "}
              {utente.nome} {utente.cognome}
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
