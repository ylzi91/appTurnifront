import React, { useCallback, useEffect, useState } from "react";

import './App.css'
import   Appturn  from './assets/img/Appturn.png'

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Button,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
//import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminPage from "./components/AdminPage";

import UserPage from "./components/UserPage";
import RequireRole from "./components/RequireRole";


function App() {

  return (
 
    <BrowserRouter>
    <Routes>
      <Route path="/" element= {<Login/>}/>
      <Route path="/admin_page/*" element={<RequireRole ruoli={["ADMIN", "CAPO"]}><AdminPage/></RequireRole>}/>
      <Route path="/user_page/*" element={<RequireRole ruoli={["USER"]}><UserPage/></RequireRole>}/>
    </Routes>
    </BrowserRouter>

     


  ); 

 
}

export default App;
