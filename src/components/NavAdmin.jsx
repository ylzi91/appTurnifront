import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { CiLogout } from "react-icons/ci";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import   Appturn  from '../assets/img/Appturn.png'
export default function NavAdmin() {
    const utente = useSelector((state) => state.user.utente)
    const role = useSelector(state => state.auth.role)
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-2">
      <Container fluid>
        <Navbar.Brand href="#home"><img className=" rounded-circle border border-black" src={Appturn} style={{width: 30}} alt="" /></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/admin_page/creazione_turni" className=" nav-link">Tabella Turni</Link>
            <Link to="/admin_page/gestisci_ferie" className=" nav-link">Gestisci ferie</Link>
            <Nav.Link href="/admin_page/gestisci_cambi">Gestisci cambio turni</Nav.Link>
            <Link to="/admin_page/registra_utente" className=" nav-link">Registra utente</Link>
            <Link to="/admin_page/gestisci_utenti" className=" nav-link">Vedi e gestisci Utenti</Link>
          </Nav>
            <div className=" d-flex align-items-center justify-content-end w-25">
                   <Link to="/admin_page/me" className=" nav-link align-self-center me-3"><img src={utente.immagine} className=" rounded-circle" style={{width: 30, height: 30}} /> {utente.nome} {utente.cognome}</Link>
            </div>
       
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
