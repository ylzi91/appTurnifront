import React, { useCallback, useEffect, useState } from "react";

import './App.css'

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  Button,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import CreazioneTurni from './components/CreazioneTurni'


function App() {

  return (
    <>
      <CreazioneTurni/>

    </> 
  ); 

 
}

export default App;
