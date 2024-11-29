import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function RegistraUtente() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [utenteCapo, checkUtenteCapo] = useState(false);
  const [response, setResponse] = useState("")
  const auth = useSelector((state) => state.auth);

  const register = async () => {
    try {
        let content;
        const response = await fetch(`${import.meta.env.VITE_URL}/utenti/${!utenteCapo ? 'utente' : 'capo'}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify({email, password, nome, cognome})
        })
        if(response.ok){
            content = await response.json()
             setResponse("Registrazione effettuata con successo")
             setCognome("")
             setNome("")
             setEmail("")
             setPassword("")
             setTimeout(() => {
                setResponse("")
             }, 2000)   
        }
        else 
        {
            content = await response.json()
            console.log(content)
            throw new Error(content.message)
        }
       
    } catch (error){
            setResponse(error.message)
    }
}

  return (
    <>
      <Card className="text-center w-25 mx-auto mt-5 bg-body-tertiary">
        <Card.Header>App Turnisitici</Card.Header>
        <Card.Body>
          <Card.Text>
            <Form onSubmit={(e) => {
                e.preventDefault()
                register()
            }}>
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
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  value={password}
                  onChange={(e) => {
                    e.preventDefault();
                    setPassword(e.target.value);
                  }}
                  placeholder="Password"
                />
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    e.preventDefault();
                    setNome(e.target.value);
                  }}
                  placeholder="Nome"
                />
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  value={cognome}
                  onChange={(e) => {
                    e.preventDefault();
                    setCognome(e.target.value);
                  }}
                  placeholder="Cognome"
                />
              </Form.Group>
              {auth.role === "ADMIN" && (
                <Form.Group className=" border border-3 rounded-1 mb-1 w-50 mx-auto">
                  <Form.Label>
                    Utente capo
                    <Form.Check
                      value={utenteCapo}
                      onChange={(e) => {
                        checkUtenteCapo(e.target.checked);
                      }}
                    />
                  </Form.Label>
                </Form.Group>
              )}

              <Button variant="success" type="submit">
                Effettua Registrazione
              </Button>      
            </Form>
            {response !== "" && <h4>{response}</h4>}
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
