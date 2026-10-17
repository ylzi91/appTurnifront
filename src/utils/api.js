export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Chiamata al backend: restituisce il JSON (anche per i 202 con {message}) o lancia ApiError con il messaggio del server
export async function apiFetch(path, { token, method = "GET", body } = {}) {
  const isFormData = body instanceof FormData;
  let risposta;
  try {
    risposta = await fetch(`${import.meta.env.VITE_URL}${path}`, {
      method,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(body !== undefined && !isFormData && { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Server non raggiungibile, riprova tra poco", 0);
  }
  const contenuto = await risposta.json().catch(() => null); // es. DELETE senza corpo
  if (!risposta.ok)
    throw new ApiError(contenuto?.message || "Errore del server, riprova più tardi", risposta.status);
  return contenuto;
}
