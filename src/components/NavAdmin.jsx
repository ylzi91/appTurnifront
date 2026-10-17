import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import Appturn from '../assets/img/Appturn.png'
import useLogout from "../utils/useLogout";

export default function NavAdmin() {
  const utente = useSelector((state) => state.user.utente)
  const logout = useLogout()
  return (
    <Navbar expand="lg" collapseOnSelect className="bg-body-tertiary mb-2">
      <Container fluid>
        <Navbar.Brand as={Link} to="/admin_page/creazione_turni"><img className=" rounded-circle border border-black" src={Appturn} style={{width: 30}} alt="AppTurni" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/admin_page/creazione_turni" eventKey="turni">Tabella Turni</Nav.Link>
            <Nav.Link as={NavLink} to="/admin_page/gestisci_ferie" eventKey="ferie">Gestisci ferie</Nav.Link>
            <Nav.Link as={NavLink} to="/admin_page/gestisci_cambi" eventKey="cambi">Gestisci cambio turni</Nav.Link>
            <Nav.Link as={NavLink} to="/admin_page/registra_utente" eventKey="registra">Registra utente</Nav.Link>
            <Nav.Link as={NavLink} to="/admin_page/gestisci_utenti" eventKey="utenti">Vedi e gestisci Utenti</Nav.Link>
          </Nav>
          <div className=" d-flex align-items-center gap-3 ms-lg-auto">
            <Nav.Link as={NavLink} to="/admin_page/me" eventKey="profilo">
              <img src={utente.immagine} className=" rounded-circle" style={{width: 30, height: 30}} alt="" /> {utente.nome} {utente.cognome}
            </Nav.Link>
            <Button variant="outline-secondary" size="sm" onClick={logout}>
              <CiLogout /> Esci
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
