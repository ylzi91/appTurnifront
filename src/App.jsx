import { lazy, Suspense } from "react";
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import RequireRole from "./components/RequireRole";
import Caricamento from "./components/Caricamento";

// Le due aree dell'app si scaricano solo quando servono
const AdminPage = lazy(() => import("./components/AdminPage"));
const UserPage = lazy(() => import("./components/UserPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Caricamento />}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin_page/*" element={<RequireRole ruoli={["ADMIN", "CAPO"]}><AdminPage /></RequireRole>} />
          <Route path="/user_page/*" element={<RequireRole ruoli={["USER"]}><UserPage /></RequireRole>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
