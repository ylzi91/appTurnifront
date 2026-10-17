import { Spinner } from "react-bootstrap";

export default function Caricamento() {
  return (
    <div className=" d-flex justify-content-center py-5">
      <Spinner animation="border" role="status">
        <span className=" visually-hidden">Caricamento…</span>
      </Spinner>
    </div>
  );
}
