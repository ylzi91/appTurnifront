import { Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function NavUser() {
    const utente = useSelector((state) => state.user.utente)
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-2">
      <Container fluid>
        <Navbar.Brand href="#home">AppTurnistici</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/user_page/turni" className=" nav-link">
              Vedi Turni
            </Link>
            <Link to="/user_page/ferie" className=" nav-link">
              Richiedi ferie
            </Link>
            <Nav.Link href="#link">Richiedi cambio turno</Nav.Link>
          </Nav>
          <div className=" d-flex align-items-center justify-content-end w-25">
            <Link
              to="/user_page/me"
              className=" nav-link align-self-center me-3"
            >
              <img
                src={utente.immagine}
                className=" rounded-circle"
                style={{ width: 30 }}
              />{" "}
              {utente.nome} {utente.cognome}
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
